#!/usr/bin/env node

/**
 * FCM Push Notification Sender (HTTP v1)
 *
 * Usage:
 *   node scripts/send-fcm.js [deviceToken] [title] [body] [chatId]
 *
 * Example:
 *   node scripts/send-fcm.js "c8RYWJ8xSV2..." "Joe Doe (Mechanic)" "I have arrived at your location!" "chat_123"
 */

const https = require("https");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const SERVICE_ACCOUNT_PATH = path.resolve(
    __dirname,
    "../auto-app-solvit-firebase-adminsdk-fbsvc-bf488e64a8.json"
);

function base64url(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

async function getAccessToken(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claim = base64url(
        JSON.stringify({
            iss: serviceAccount.client_email,
            scope: "https://www.googleapis.com/auth/firebase.messaging",
            aud: "https://oauth2.googleapis.com/token",
            exp: now + 3600,
            iat: now,
        })
    );

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(`${header}.${claim}`);
    const signature = sign
        .sign(serviceAccount.private_key, "base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const jwt = `${header}.${claim}.${signature}`;

    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    return new Promise((resolve, reject) => {
        const req = https.request(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(postData),
                },
            },
            (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.access_token) {
                            resolve(parsed.access_token);
                        } else {
                            reject(new Error(`OAuth error: ${data}`));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        );
        req.on("error", reject);
        req.write(postData);
        req.end();
    });
}

async function sendFcmMessage(serviceAccount, token, title, body, dataPayload = {}) {
    const accessToken = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.project_id;

    const payload = JSON.stringify({
        message: {
            token: token,
            notification: {
                title: title,
                body: body,
            },
            data: dataPayload,
            android: {
                priority: "high",
                notification: {
                    channel_id: "chat_channel",
                    sound: "default",
                },
            },
        },
    });

    return new Promise((resolve, reject) => {
        const req = https.request(
            `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(payload),
                },
            },
            (res) => {
                let respData = "";
                res.on("data", (chunk) => (respData += chunk));
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(respData));
                    } else {
                        reject(new Error(`FCM request failed (${res.statusCode}): ${respData}`));
                    }
                });
            }
        );
        req.on("error", reject);
        req.write(payload);
        req.end();
    });
}

async function main() {
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.error("Service account file not found at:", SERVICE_ACCOUNT_PATH);
        process.exit(1);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));

    const args = process.argv.slice(2);
    const targetToken =
        args[0] ||
        "c8RYWJ8xSV2_nNGOuRGn0n:APA91bEkdaZnN0TvtNNGsfhPBjhY4V1864XdLodx0DIrF7m79y2pdhhch5J9V0OwlYx_yU-J7HrpXF4qTkMPmBcxlH--QBRkqCEenrqxDmdJhuf_3IjuZRk";
    const title = args[1] || "AUTO Mechanic Chat";
    const body = args[2] || "Hello! Your mechanic Joe Doe has replied to your message.";
    const chatId = args[3] || "chat_sample";

    console.log("==========================================");
    console.log("🚀 Sending Real FCM Push Notification");
    console.log(`📱 Project: ${serviceAccount.project_id}`);
    console.log(`🎯 Recipient Token: ${targetToken.substring(0, 20)}...`);
    console.log(`💬 Title: ${title}`);
    console.log(`📝 Body: ${body}`);
    console.log("==========================================");

    try {
        const result = await sendFcmMessage(serviceAccount, targetToken, title, body, {
            type: "chat",
            chatId: chatId,
        });
        console.log("✅ Push notification sent successfully!");
        console.log("Response:", result);
    } catch (err) {
        console.error("❌ Failed to send FCM notification:", err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { sendFcmMessage, getAccessToken };
