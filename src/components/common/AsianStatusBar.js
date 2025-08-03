import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { asianTheme } from '../../styles/asianTheme';
import { STATUS_BAR_CONFIG } from '../../utils/constants';

const AsianStatusBar = ({
  backgroundColor = asianTheme.colors.secondary.pearl,
  barStyle = STATUS_BAR_CONFIG.DARK_CONTENT,
  translucent = true
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        backgroundColor={STATUS_BAR_CONFIG.DEFAULT_COLOR} // Usar transparent en vez de un color específico
      />
      {translucent && (
        <View
          style={[
            styles.statusBarBackground,
            { backgroundColor, height: insets.top }
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default AsianStatusBar;