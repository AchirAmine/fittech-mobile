import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { LightColors, DarkColors } from '@shared/constants/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      
      
      
      const colors = DarkColors; 

      return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
              <Ionicons name="alert-circle" size={80} color={colors.error} />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Oops! Something went wrong
            </Text>
            
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </Text>

            <View style={[styles.errorDetailContainer, { backgroundColor: colors.cardSecondary }]}>
              <ScrollView style={styles.errorScroll}>
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {this.state.error?.toString()}
                </Text>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={this.handleRestart}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color={colors.white} style={styles.buttonIcon} />
              <Text style={[styles.retryButtonText, { color: colors.white }]}>
                Try Again
              </Text>
            </TouchableOpacity>

            <Text style={[styles.footer, { color: colors.textMuted }]}>
              If the problem persists, please contact support.
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  errorDetailContainer: {
    width: '100%',
    maxHeight: 150,
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  errorScroll: {
    flexGrow: 0,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  retryButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  retryButtonText: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  footer: {
    marginTop: 40,
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
  },
});
