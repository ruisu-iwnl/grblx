/**
 * Lambda that fetches Roblox games stats. Call from grblx.com to avoid CORS.
 * Use this in AWS Lambda (inline or zip). Handler: index.handler
 * CORS is handled by the Function URL config in AWS – do not add CORS headers here or you get duplicate values.
 */

const ROBLOX_URL = "https://games.roblox.com/v1/games?universeIds=1147304238,5768456460,5117861193";

exports.handler = async (event) => {
  const method = event.httpMethod ?? event.requestContext?.http?.method;
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: {}, body: "" };
  }

  try {
    const res = await fetch(ROBLOX_URL);
    if (!res.ok) throw new Error("Roblox API " + res.status);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("active-players Lambda error:", err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch games" }),
    };
  }
};
