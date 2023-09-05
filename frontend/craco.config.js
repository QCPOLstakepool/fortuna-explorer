module.exports = {
  webpack: {
    configure: {
      experiments: {
        topLevelAwait: true,
        asyncWebAssembly: true,
      },
    },
  },
};