import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

export type PaymentMethod = 'credit_card' | 'cash';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        SELECT PAYMENT METHOD
      </Text>
      <View style={styles.paymentMethodsContainer}>
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            {
              backgroundColor: colors.card,
              borderColor: selectedMethod === 'credit_card' ? colors.primaryMid : colors.border,
              borderWidth: selectedMethod === 'credit_card' ? 1.5 : 1,
              shadowColor: colors.black,
            },
          ]}
          onPress={() => onSelectMethod('credit_card')}
          activeOpacity={0.7}
        >
          <View style={[styles.paymentMethodIconWrap, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="card-outline" size={24} color={colors.primaryMid} />
          </View>
          <View style={styles.paymentMethodTextContent}>
            <Text style={[styles.paymentMethodTitle, { color: colors.textPrimary }]}>
              Credit Card
            </Text>
            <Text style={[styles.paymentMethodSubtitle, { color: colors.textSecondary }]}>
              Secure payment via Stripe
            </Text>
          </View>
          <View style={[
            styles.radioCircle,
            { 
              borderColor: selectedMethod === 'credit_card' ? colors.primaryMid : colors.border,
              backgroundColor: selectedMethod === 'credit_card' ? colors.primaryMid + '15' : 'transparent'
            }
          ]}>
            {selectedMethod === 'credit_card' && <Ionicons name="checkmark" size={12} color={colors.primaryMid} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            {
              backgroundColor: colors.card,
              borderColor: selectedMethod === 'cash' ? colors.primaryMid : colors.border,
              borderWidth: selectedMethod === 'cash' ? 1.5 : 1,
              shadowColor: colors.black,
            },
          ]}
          onPress={() => onSelectMethod('cash')}
          activeOpacity={0.7}
        >
          <View style={[styles.paymentMethodIconWrap, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="cash-outline" size={24} color={colors.primaryMid} />
          </View>
          <View style={styles.paymentMethodTextContent}>
            <Text style={[styles.paymentMethodTitle, { color: colors.textPrimary }]}>
              Cash Payment
            </Text>
            <Text style={[styles.paymentMethodSubtitle, { color: colors.textSecondary }]}>
              Pay at the front desk
            </Text>
          </View>
          <View style={[
            styles.radioCircle,
            { 
              borderColor: selectedMethod === 'cash' ? colors.primaryMid : colors.border,
              backgroundColor: selectedMethod === 'cash' ? colors.primaryMid + '15' : 'transparent'
            }
          ]}>
            {selectedMethod === 'cash' && <Ionicons name="checkmark" size={12} color={colors.primaryMid} />}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  paymentMethodsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  paymentMethodIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentMethodTextContent: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
