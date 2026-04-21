import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { NeonButton } from '@shared/components/ui/NeonButton';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useHireCoach } from '../hooks/useCoaching';
interface CoachActionFooterProps {
  coachId: string;
  invitationId?: string;
  name: string;
  price: number;
  initialStatus?: 'idle' | 'requested' | 'accepted';
  onHireTriggered?: () => void;
  image: any;
}
export const CoachActionFooter = ({ 
  coachId, 
  invitationId,
  name, 
  price, 
  initialStatus = 'idle',
  onHireTriggered,
  image
}: CoachActionFooterProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { mutate: hireCoach, isPending } = useHireCoach();
  const [requestStatus, setRequestStatus] = useState(initialStatus);
  React.useEffect(() => {
    setRequestStatus(initialStatus);
  }, [initialStatus]);
  const [showModal, setShowModal] = useState(false);
  const handleHire = () => {
    hireCoach(coachId, {
      onSuccess: () => {
        setRequestStatus('requested');
        setShowModal(true);
        onHireTriggered?.();
      }
    });
  };
  const handleConfirmPayment = () => {
    navigation.navigate(ROUTES.MAIN.PAYMENT_DETAILS, { 
      plan: {
        type: 'coaching',
        id: coachId,
        invitationId: invitationId,
        title: `Coaching with ${name}`,
        price: price,
        currency: 'DA',
        billingCycle: 'monthly',
        duration: 1,
        image: image,
        features: [
          { label: 'Session', icon: 'fitness', details: ['1x Personal Training Session'] },
          { label: 'Access', icon: 'chatbubbles', details: [`Direct access to ${name}`] }
        ],
        isPopular: false
      } as any
    });
  };
  return (
    <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      <NeonButton 
        title={
          requestStatus === 'requested' ? "Request Sent!" : 
          requestStatus === 'accepted' ? `Confirm payment · ${price} DA` :
          `Hire ${name.split(' ')[0]} · ${price} DA`
        }
        onPress={
          requestStatus === 'requested' ? () => {} :
          requestStatus === 'accepted' ? handleConfirmPayment :
          handleHire
        } 
        outlined={requestStatus === 'requested'}
        icon={requestStatus === 'requested' ? "checkmark-outline" : undefined}
        loading={isPending}
      />
      <StatusModal
        visible={showModal}
        type="success"
        title="Request Sent!"
        message={`Your personal training request has been successfully sent to Coach ${name.split(' ')[0]}. Once he accept your request you can pay.`}
        onConfirm={() => {
          setShowModal(false);
        }}
        onClose={() => setShowModal(false)}
        confirmText="OK"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 20,
    borderTopWidth: 1,
  },
});
