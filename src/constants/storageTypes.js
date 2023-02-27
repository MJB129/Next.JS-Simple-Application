const defaultStorageTypes = [
  {
    type: 'S3',
    options: [
      'ACCESS_KEY_ID',
      'SECRET_ACCESS_KEY',
      'DEFAULT_REGION',
      'BUCKET',
      'AWS_URL',
      'AWS_ENDPOINT',
    ],
  },
  {
    type: 'Google Drive',
    options: ['CLIENT_ID', 'CLIENT_SECRET', 'REFRESH_TOKEN', 'PLAYBACK_URL'],
  },
  {
    type: 'Dropbox',
    options: ['TOKEN', 'SECRET', 'PLAYBACK_URL'],
  },
]

export default defaultStorageTypes
