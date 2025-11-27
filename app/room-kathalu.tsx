import { InfoBlock, InfoPage } from '@/components/info-page';

export default function RoomKathaluScreen() {
  return (
    <InfoPage
      title="Room Kathalu"
      description="A living library of stories born inside 305-B. Share memories, lessons, and the tiny surprises that made your stay unforgettable.">
      <InfoBlock
        title="How to contribute"
        body="Voice notes, doodles, or late-night thoughts—all formats are welcome."
        bullets={['Tag the mood (calm, chaotic, inspired, etc.)', 'Add the playlist or snack that fueled the moment', 'Consent checkbox so we can share anonymously']}
      />
      <InfoBlock
        title="Featured tales"
        body="Every Sunday we spotlight three Kathalu entries in the home dashboard so residents can remix traditions."
        footer="Keep it kind, keep it vivid, and keep it under 200 words."
      />
    </InfoPage>
  );
}

