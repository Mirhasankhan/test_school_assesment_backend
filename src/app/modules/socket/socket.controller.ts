import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./socket.service";
import { parse } from "url";
import redisClient from "../../utils/radis";
import { Room } from "../room/room.model";
import { Types } from "mongoose";
import { Message } from "../message/message.model";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const roomUsers = new Map<string, Set<WebSocket>>();
const groupUsers = new Map<string, Set<WebSocket>>();
const connectedUsers = new Set<CustomWebSocket>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const { query } = parse(req.url!, true);
    let authToken = req.headers["x-token"] as string;
    if (!authToken && query["x-token"]) {
      authToken = Array.isArray(query["x-token"])
        ? query["x-token"][0]
        : query["x-token"];
    }
    if (!authToken) {
      console.log("No token provided — closing connection");
      ws.close();
      return;
    }
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) {
      return;
    }
    const userId = decoded.id;
    ws.userId = userId;
    connectedUsers.add(ws);
    // Save the socket for later
    if (!roomUsers.has(userId)) roomUsers.set(userId, new Set());
    roomUsers.get(userId)?.add(ws);
    if (!groupUsers.has(userId)) groupUsers.set(userId, new Set());
    groupUsers.get(userId)?.add(ws);

    let roomId: string | null = null;
    console.log("room", roomId);

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    const conversations = await Room.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate([
        {
          path: "user1",
          select: "id fullName profileImage",
        },
        {
          path: "user2",
          select: "id fullName profileImage",
        },
      ]);

    const connectedUserIds = Array.from(connectedUsers)
      .map((ws) => ws.userId)
      .filter((id) => id !== undefined);

    const formattedConversations = await Promise.all(
      conversations.map(async (room: any) => {
        const partner = room.user1?._id === userId ? room.user2 : room.user1;
        const isActive = connectedUserIds.includes(partner?._id as string);

        const redisKey = `room:${room.id}:messages`;
        const unreadKey = `room:${room.id}:unread:${userId}`;

        const [redisRaw, unreadCountStr] = await Promise.all([
          redisClient.lRange(redisKey, 0, -1),
          redisClient.get(unreadKey),
        ]);

        const unreadCount = parseInt(unreadCountStr || "0", 30);
        let latestMessage = null;

        if (redisRaw.length > 0) {
          const redisMessages = redisRaw.map((msg) => JSON.parse(msg));

          // Sort by createdAt descending
          redisMessages.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          const latestRedisMsg = redisMessages[0];

          latestMessage = {
            content:
              latestRedisMsg.content ??
              (latestRedisMsg.fileUrl ? "sent file" : null),
            createdAt: latestRedisMsg.createdAt,
          };
        }

        return {
          roomId: room.id,
          partner: {
            id: partner?.id,
            userName: partner?.fullName,
            profileImage: partner?.profileImage,
            isActive,
          },
          lastMessage: latestMessage,
          unreadCount, // From Redis
        };
      })
    );
    ws.send(
      JSON.stringify({
        type: "conversation",
        conversations: formattedConversations,
      })
    );

    ws.on("message", async (message: any) => {
      try {
        const { type, receiverId, content, fileUrl } = JSON.parse(
          message.toString()
        );

        const getConversationsForUser = async (targetUserId: string) => {
          const objectId = new Types.ObjectId(targetUserId);
          const rooms = await Room.find({
            $or: [{ user1: objectId }, { user2: objectId }],
          })
            .sort({ updatedAt: -1 })
            .populate([
              {
                path: "user1",
                select: "id fullName profileImage",
              },
              {
                path: "user2",
                select: "id fullName profileImage",
              },
            ]);

          return Promise.all(
            rooms.map(async (room: any) => {
              const partner =
                room.user1?._id === targetUserId ? room.user2 : room.user1;
              const isActive = connectedUserIds.includes(
                partner?._id as string
              );

              const redisKey = `room:${room.id}:messages`;
              const unreadKey = `room:${room.id}:unread:${targetUserId}`;

              // Get the latest message from Redis
              const buffered = await redisClient.lRange(redisKey, -1, -1);
              const lastMessage =
                buffered.length > 0 ? JSON.parse(buffered[0]) : null;

              // Get unread count from Redis (fallback to 0 if not found)
              const unreadCountStr = await redisClient.get(unreadKey);
              const unreadCount = parseInt(unreadCountStr || "0", 30);

              // Determine content
              const lastMessageContent =
                lastMessage?.content ||
                (lastMessage?.fileUrl?.length > 0 ? "sent file" : null);

              return {
                roomId: room.id,
                partner: {
                  id: partner?.id,
                  userName: partner?.fullName,
                  profileImage: partner?.profileImage,
                  isActive,
                },
                lastMessage: lastMessage
                  ? {
                      content: lastMessageContent,
                      createdAt: lastMessage?.createdAt || null,
                    }
                  : null,
                unreadCount,
              };
            })
          );
        };

        switch (type) {
          case "subscribe": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiverId is required",
                })
              );
            }

            const objectUserId = new Types.ObjectId(userId);
            const objectReceiverId = new Types.ObjectId(receiverId);

            let room = await Room.findOne({
              $or: [
                { user1: objectUserId, user2: objectReceiverId },
                { user1: objectReceiverId, user2: objectUserId },
              ],
            });

            if (!room) {
              room = await Room.create({
                user1: objectUserId,
                user2: objectReceiverId,
              });
            }

            roomId = room._id?.toString();

            const unreadKey = `room:${roomId}:unread:${userId}`;
            await redisClient.set(unreadKey, "0");

            roomUsers.forEach((clients, key) => {
              if (clients.has(ws)) {
                clients.delete(ws);
                if (clients.size === 0) roomUsers.delete(key);
              }
            });

            if (!roomUsers.has(roomId)) {
              roomUsers.set(roomId, new Set());
            }
            roomUsers.get(roomId)?.add(ws);

            const redisKey = `room:${roomId}:messages`;
            const redisRaw = await redisClient.lRange(redisKey, -30, -1);
            const messages = redisRaw.reverse().map((msg) => JSON.parse(msg));

            ws.send(
              JSON.stringify({
                type: "past-messages",
                roomId,
                messages: messages,
              })
            );

            const senderConversations = await getConversationsForUser(userId);
            ws.send(
              JSON.stringify({
                type: "conversation",
                conversations: senderConversations,
              })
            );

            break;
          }

          case "send-message": {
            if (!roomId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "You are not subscribed to any room",
                })
              );
            }

            const objectRoomId = new Types.ObjectId(roomId);
            const roomInfo = await Room.findById(objectRoomId).select(
              "user1 user2"
            );

            if (!roomInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Room not found",
                })
              );
            }

            const messagePayload = {
              content,
              user1Id: userId,
              user2Id: receiverId,
              roomId,
              fileUrl: fileUrl ?? [""],
              createdAt: new Date().toISOString(),
            };

            const redisKey = `room:${roomId}:messages`;
            await redisClient.rPush(redisKey, JSON.stringify(messagePayload));
            const unreadKey = `room:${roomId}:unread:${receiverId}`;
            await redisClient.incr(unreadKey);
            const count = await redisClient.lLen(redisKey);

            if (count >= 30) {
              const messagesToSaveRaw = await redisClient.lRange(
                redisKey,
                0,
                14
              );
              const messagesToSave = messagesToSaveRaw.map((msg) =>
                JSON.parse(msg)
              );

              await Message.insertMany(messagesToSave);

              await redisClient.lTrim(redisKey, 15, -1);
            }

            // Update the room's updatedAt
            await Room.findByIdAndUpdate(
              objectRoomId,
              { updatedAt: new Date() },
              { new: true }
            );

            // Broadcast message to all room clients
            roomUsers.get(roomId)?.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "new-message",
                    message: messagePayload,
                    roomId,
                  })
                );
              }
            });

            // Send updated conversation list to receiver (if online)
            const target = Array.from(connectedUsers).find(
              (client) => client.userId === receiverId
            );

            if (target) {
              const receiverConversations = await getConversationsForUser(
                receiverId
              );
              target.send(
                JSON.stringify({
                  type: "conversation",
                  conversations: receiverConversations,
                })
              );
            }

            const senderConversations = await getConversationsForUser(userId);
            ws.send(
              JSON.stringify({
                type: "conversation",
                conversations: senderConversations,
              })
            );
            break;
          }

          case "conversation": {
            const conversations = await Room.find({
              $or: [{ user1: userId }, { user2: userId }],
            })
              .sort({ updatedAt: -1 })
              .populate([
                {
                  path: "user1",
                  select: "id fullName profileImage",
                },
                {
                  path: "user2",
                  select: "id fullName profileImage",
                },
              ]);

            const connectedUserIds = Array.from(connectedUsers)
              .map((ws) => ws.userId)
              .filter((id) => id !== undefined);

            const formattedConversations = await Promise.all(
              conversations.map(async (room: any) => {
                const partner =
                  room.user1?._id === userId ? room.user2 : room.user1;
                const isActive = connectedUserIds.includes(
                  partner?._id as string
                );

                const redisKey = `room:${room.id}:messages`;
                const unreadKey = `room:${room.id}:unread:${userId}`;

                const [redisRaw, unreadCountStr] = await Promise.all([
                  redisClient.lRange(redisKey, 0, -1),
                  redisClient.get(unreadKey),
                ]);

                const unreadCount = parseInt(unreadCountStr || "0", 30);
                let latestMessage = null;

                if (redisRaw.length > 0) {
                  const redisMessages = redisRaw.map((msg) => JSON.parse(msg));

                  // Sort by createdAt descending
                  redisMessages.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  );

                  const latestRedisMsg = redisMessages[0];

                  latestMessage = {
                    content:
                      latestRedisMsg.content ??
                      (latestRedisMsg.fileUrl ? "sent file" : null),
                    createdAt: latestRedisMsg.createdAt,
                  };
                }

                return {
                  roomId: room.id,
                  partner: {
                    id: partner?.id,
                    userName: partner?.fullName,
                    profileImage: partner?.profileImage,
                    isActive,
                  },
                  lastMessage: latestMessage,
                  unreadCount, // From Redis
                };
              })
            );
            ws.send(
              JSON.stringify({
                type: "conversation",
                conversations: formattedConversations,
              })
            );

            break;
          }

          default:
            ws.send(
              JSON.stringify({ type: "error", message: "Invalid message type" })
            );
        }
      } catch (err: unknown) {
        if (err instanceof SyntaxError) {
          ws.send(JSON.stringify({ type: "error", message: "Bad JSON" }));
        } else if (err instanceof Error) {
          ws.send(JSON.stringify({ type: "error", message: err }));
        } else {
          ws.send(
            JSON.stringify({ type: "error", message: "Unexpected error" })
          );
        }
      }
    });

    ws.on("close", async () => {
      connectedUsers?.delete(ws);

      if (roomId) {
        const clients = roomUsers.get(roomId);
        clients?.delete(ws);
        if (clients?.size === 0) roomUsers.delete(roomId);
      }
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss, roomUsers };
