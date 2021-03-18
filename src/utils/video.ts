import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import toUpper from 'lodash/toUpper';

import { Audio, Streaming, Subtitle } from 'api';
import { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';

import { fixProtocol } from 'utils/url';

const formatIdx = (idx: number) => (idx < 10 ? `0${idx}` : idx);

export function mapAudios(audios: Audio[], ac3ByDefault?: boolean, savedAudioId?: string): AudioTrack[] {
  return map(audios, (audio, idx) => {
    const name = filter([
      audio.type?.title && audio.author?.title ? `${audio.type?.title}.` : audio.type?.title,
      audio.author?.title,
      audio.type?.title || audio.author?.title ? `(${toUpper(audio.lang)})` : toUpper(audio.lang),
      audio.codec === 'ac3' && toUpper(audio.codec),
    ]).join(' ');
    const number = `${formatIdx(idx + 1)}.`;
    const id = `${number} ${name}`;

    return {
      id,
      name,
      number,
      lang: audio.lang,
      default: (savedAudioId && savedAudioId === id) || (!savedAudioId && ac3ByDefault && audio.codec === 'ac3'),
    };
  });
}

export function mapSources(
  files: { url: string | { [key in Streaming]?: string }; quality?: string; codec?: 'h264' | 'h265' }[],
  streamingType?: Streaming,
  defaultQuality?: string | null,
  savedSourceId?: string,
): SourceTrack[] {
  return orderBy(
    map(files, (file) => {
      const src = (typeof file.url === 'string' ? file.url : file.url[streamingType!] || file.url.http!) as string;
      const name = `${file.quality!}${file.codec ? ` (${file.codec === 'h265' ? 'HEVC' : 'AVC'})` : ''}`;
      const id = file.quality ? `${file.quality}_${file.codec}` : src;

      return {
        id,
        name,
        src: fixProtocol(src),
        type: src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
        // default:
        //   defaultQuality && savedSourceId
        //     ? parseInt(defaultQuality) < parseInt(savedSourceId) && defaultQuality === id
        //     : savedSourceId
        //     ? savedSourceId === id
        //     : defaultQuality === id,
        default: (savedSourceId && savedSourceId === id) || (!savedSourceId && parseInt(id) === parseInt(defaultQuality ?? '')),
      };
    }),
    ({ name }) => parseInt(name),
    'desc',
  );
}

export function mapSubtitles(subtitles: Subtitle[], forcedByDefault?: boolean, savedSubtitleId?: string | null): SubtitleTrack[] {
  return map(subtitles, (subtitle, idx) => {
    const name = `${toUpper(subtitle.lang)}${subtitle.forced ? ' Forced' : ''}`;
    const number = `${formatIdx(idx + 1)}.`;
    const id = `${number} ${name}`;

    return {
      id,
      name,
      number,
      lang: subtitle.lang,
      src: fixProtocol(subtitle.url),
      default:
        (savedSubtitleId && savedSubtitleId === id) || (!savedSubtitleId && forcedByDefault && subtitle.forced && subtitle.lang === 'rus'),
    };
  });
}
