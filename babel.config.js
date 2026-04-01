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
            '@features/account': './src/features/account',
            '@shared': './src/shared',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@appTypes': './src/types',
            '@screens': './src/screens',
            '@assets': './assets'
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
