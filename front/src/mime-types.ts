// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

export type TValue<T> = T extends (infer I)[]
    ? I
    : T extends (...args: any[]) => infer V
    ? V
    : T extends Object
    ? T[keyof T]
    : T; 
  
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const mozillaOrgMimeTypes = {
  'audio/aac': '.aac',
  'application/x-abiword': '.abw',
  'application/x-freearc': '.arc',
  'image/avif': '.avif', 
  'video/x-msvideo': '.avi',
  'application/vnd.amazon.ebook': '.azw',
  'application/octet-stream': '.bin',
  'image/bmp': '.bmp',
  'application/x-bzip': '.bz',
  'application/x-bzip2': '.bz2',
  'application/x-cdf': '.cda',
  'application/x-csh': '.csh',
  'text/css': '.css',
  'text/csv': '.csv',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-fontobject': '.eot',
  'application/epub+zip': '.epub',
  'application/gzip': '.gz',
  'image/gif': '.gif',
  'text/html': ['.htm', '.html'],
  'image/vnd.microsoft.icon': '.ico',
  'text/calendar': '.ics',
  'application/java-archive': '.jar',
  'image/jpeg': ['.jpeg', '.jpg'],
  'text/javascript': ['.js', '.mjs'],
  'application/json': '.json',
  'application/ld+json': '.jsonld',
  'audio/midi' : ['.mid', '.midi'],
  'audio/x-midi' : ['.mid', '.midi'],
  'audio/mpeg': '.mp3',
  'video/mp4': '.mp4',
  'video/mpeg': '.mpeg',
  'application/vnd.apple.installer+xml': '.mpkg',
  'application/vnd.oasis.opendocument.presentation': '.odp',
  'application/vnd.oasis.opendocument.spreadsheet': '.ods',
  'application/vnd.oasis.opendocument.text': '.odt',
  'audio/ogg': '.oga',
  'video/ogg': '.ogv',
  'application/ogg': '.ogx',
  'audio/opus': '.opus',
  'font/otf': '.otf',
  'image/png': '.png',
  'application/pdf': '.pdf',
  'application/x-httpd-php': '.php',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.rar': '.rar',
  'application/rtf': '.rtf',
  'application/x-sh': '.sh',
  'image/svg+xml': '.svg',
  'application/x-shockwave-flash': '.swf',
  'application/x-tar': '.tar',
  'image/tiff': ['.tif', '.tiff'],
  'video/mp2t': '.ts',
  'font/ttf': '.ttf',
  'text/plain': '.txt',
  'application/vnd.visio': '.vsd',
  'audio/wav': '.wav',
  'audio/webm': '.weba',
  'video/webm': '.webm',
  'image/webp': '.webp',
  'font/woff': '.woff',
  'font/woff2': '.woff2',
  'application/xhtml+xml': '.xhtml',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/xml': '.xml',
  'text/xml': '.xml',
  'application/atom+xml': '.xml',
  'application/vnd.mozilla.xul+xml': '.xul',
  'application/zip': '.zip',
  'video/3gpp': '.3gp',
  'audio/3gpp': '.3gp',
  'video/3gpp2': '.3g2',
  'audio/3gpp2': '.3g2',
  'application/x-7z-compressed': '.7z'
} as const;

export const mimeTypes = mozillaOrgMimeTypes;
export const getExtension = <Key extends keyof typeof mozillaOrgMimeTypes> (key: Key) => {
  let estension = mozillaOrgMimeTypes[key];
  if(Array.isArray(estension)) {
    estension = estension[estension.length - 1];
  }
  return estension;
};

type FillPrefixMimes<T extends string> = T extends `${infer KEY}/${string}` ? `${KEY}/*` : T;
export type MimeTypesFiles = keyof typeof mimeTypes;
export type MimeTypes = FillPrefixMimes<MimeTypesFiles> | MimeTypesFiles;

type MapMimeTypesExtensionsValues<Type> = Type extends readonly (infer I)[] ? I : Type;
export type MimeTypesExtensions = MapMimeTypesExtensionsValues<TValue<typeof mozillaOrgMimeTypes>>;