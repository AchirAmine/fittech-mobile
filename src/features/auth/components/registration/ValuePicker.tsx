import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItemInfo, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
export interface ValuePickerProps<T> {
  data: T[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  formatValue?: (item: T) => string;
  itemHeight?: number;
  visibleItems?: number;
  unit?: string;
  unitOverlayMarginLeft?: number;
}
export function ValuePicker<T>({
  data,
  selectedIndex,
  onIndexChange,
  formatValue = (item) => String(item),
  itemHeight = 56,
  visibleItems = 7,
  unit,
  unitOverlayMarginLeft = 40,
}: ValuePickerProps<T>): React.ReactElement {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList<T>>(null);
  const pickerHeight = itemHeight * visibleItems;
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      onIndexChange(Math.max(0, Math.min(index, data.length - 1)));
    },
    [data.length, itemHeight, onIndexChange]
  );
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      const diff = Math.abs(index - selectedIndex);
      const opacity = diff === 0 ? 1 : diff === 1 ? 0.6 : diff === 2 ? 0.35 : 0.15;
      const fontSize = diff === 0 ? 40 : diff === 1 ? 30 : diff === 2 ? 24 : 18;
      return (
        <View style={[styles.item, { height: itemHeight }]}>
          <Text
            style={[
              styles.itemText,
              { color: colors.primaryMid, fontSize, opacity },
            ]}
          >
            {formatValue(item)}
          </Text>
        </View>
      );
    },
    [selectedIndex, colors, itemHeight, formatValue]
  );
  return (
    <View style={[styles.pickerContainer, { height: pickerHeight }]}>
      <View
        style={[
          styles.selectionLine,
          { borderColor: colors.primaryMid, top: pickerHeight / 2 - itemHeight / 2 },
        ]}
      />
      <View
        style={[
          styles.selectionLine,
          { borderColor: colors.primaryMid, top: pickerHeight / 2 + itemHeight / 2 },
        ]}
      />
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{
          paddingVertical: pickerHeight / 2 - itemHeight / 2,
        }}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
      />
      {unit && (
        <View
          style={[
            styles.unitOverlay,
            {
              top: pickerHeight / 2 - itemHeight / 2,
              height: itemHeight,
              marginLeft: unitOverlayMarginLeft,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.unitFixedText, { color: colors.textSecondary }]}>{unit}</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  pickerContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  selectionLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 2,
    zIndex: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
  },
  unitOverlay: {
    position: 'absolute',
    left: '50%',
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 20,
  },
  unitFixedText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 18,
  },
});
