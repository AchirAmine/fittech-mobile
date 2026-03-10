module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@features': './src/features',
            '@shared': './src/shared',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@appTypes': './src/types'
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
