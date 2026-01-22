import "dotenv/config"
import { Client, GatewayIntentBits, Events } from "discord.js"
import fs from "fs"

// change upon using different discord-channel
const CHANNEL_ID = "932063857906683944"

const EMOJI_SCORE_MAP = {
  "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5,
  "6️⃣": 6, "7️⃣": 7, "8️⃣": 8, "9️⃣": 9, "🔟": 10,
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // required for server-based bots
    GatewayIntentBits.GuildMessages, // message history
    GatewayIntentBits.MessageContent, // message content
    GatewayIntentBits.GuildMessageReactions, // message reactions
  ],
})

async function fetchAllMessages(channel) {
  const allMessages = []
  let lastId = null

  while (true) {
    // discord only allows 100 messages per request
    // therefore they must be fetched in batches of 100
    const options = { limit: 100 }
    if (lastId) options.before = lastId

    const messages = await channel.messages.fetch(options)
    if (messages.size === 0) break

    allMessages.push(...messages.values())
    lastId = messages.last().id
  }

  return allMessages
}

function extractImages(message) {
  return [...message.attachments.values()]
    .filter((a) => a.contentType?.startsWith("image/"))
    .map((a) => ({
      url: a.url,
      filename: a.name,
      width: a.width,
      height: a.height,
    }))
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function extractReactions(message) {
  const reactions = []

  for (const reaction of message.reactions.cache.values()) {
    const users = await reaction.users.fetch()

    const emojiName = reaction.emoji.name
    const score = EMOJI_SCORE_MAP[emojiName] ?? null

    reactions.push({
      emoji: {
        name: emojiName,
        id: reaction.emoji.id,
        is_custom: !!reaction.emoji.id,
        raw: reaction.emoji.toString(),
      },
      score,
      users: [...users.values()].map((u) => ({
        id: u.id,
        username_at_time: u.username,
      })),
    })

    // rate-limit protection
    await sleep(250)
  }

  return reactions
}

async function buildMessageObject(message) {
  const images = extractImages(message)
  if (images.length === 0) return null

  return {
    message_id: message.id,
    timestamp: message.createdAt.toISOString(),
    author: {
      id: message.author.id,
      username_at_time: message.author.username,
    },
    content: message.content,
    images,
    reactions: await extractReactions(message),
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`)

  const channel = await client.channels.fetch(CHANNEL_ID)
  console.log(`📬 Found channel: ${channel.name}`)

  const messages = await fetchAllMessages(channel)
  console.log(`📦 Retrieved ${messages.length} messages`)

  const output = {
    channel: channel.name,
    messages: [],
  }

  let processed = 0

  for (const msg of messages) {
    processed++
    
    const data = await buildMessageObject(msg)
    if (data) output.messages.push(data)

    if (processed % 25 === 0) {
      console.log(
        `⏳ Processed ${processed}/${messages.length} messages ` +
          `(${output.messages.length} food posts)`
      )
    }
  }

  fs.writeFileSync("food.json", JSON.stringify(output, null, 2))
  console.log(`✅ Exported ${output.messages.length} food posts`)

  process.exit(0)
})

client.login(process.env.BOT_TOKEN)