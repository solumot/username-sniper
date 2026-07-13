const c = "abcdefghijklmnopqrstuvwxyz0123456789._";
const url = "https://discord.com/api/v9/users/@me/pomelo-attempt";
const authorization = "YOUR_DISCORD_TOKEN";

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = () => [...Array(12)].map(() => c[(Math.random() * c.length) | 0]).join("");

async function find_username(username) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: authorization, "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return { username, ...(await res.json()) };
}

for (let i = 0; ; i++) {
  const username = rand();
  const { retry_after, taken, message } = await find_username(username);

  if (retry_after) {
    console.log("Rate limited");
    await sleep(retry_after * 1000);
  } else {
    await sleep(i % 10 === 9 ? 5000 : 500);
  }

  if (!taken) console.log(`${username}`);
}
