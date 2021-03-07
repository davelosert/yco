const config = {
  branches: [
    { name: 'main' },
    { name: 'alpha', channel: 'alpha', prerelease: 'alpha' }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/git'
  ]
};

module.exports = config;
