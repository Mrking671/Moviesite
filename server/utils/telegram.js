import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const session = new StringSession(process.env.TELEGRAM_SESSION || '');

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

export async function connectTelegram() {
  await client.start({
    botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
  });
}

export async function searchTelegramFiles(title) {
  const result = await client.invoke({
    _: 'messages.Search',
    peer: process.env.TELEGRAM_CHANNEL_ID,
    q: title,
    filter: { _: 'InputMessagesFilterDocument' },
    limit: 100,
  });

  return result.messages.map(msg => ({
    fileId: `${msg.media.document.id}_${msg.media.document.accessHash}`,
    quality: (msg.message.match(/(\d+p|HD|HDRip)/i) || ['HD'])[0],
    size: Math.round(msg.media.document.size / 1048576),
  }));
}

export async function downloadTelegramFile(fileId) {
  const [id, accessHash] = fileId.split('_');
  const document = new Api.InputDocument({
    id: BigInt(id),
    accessHash: BigInt(accessHash),
    fileReference: new Uint8Array(),
  });

  const media = await client.downloadMedia(document, { workers: 1 });
  return {
    stream: Buffer.from(media),
    filename: `movie_${fileId.slice(0, 8)}.mp4`
  };
}
