import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { StatusModal, StatusModalType } from '@shared/components/ui/StatusModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MembershipStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  useSuspensionRequests,
  useCreateSuspensionRequest,
  useCancelSuspensionRequest,
  useDirectSuspensions,
  useCreateDirectSuspension,
  useResumeDirectSuspension,
  useSuspensionPolicy,
} from '../hooks/useSuspension';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { hexToRGBA } from '@shared/constants/colors';
import { SuspensionRequestStatus } from '../services/suspensionApi';

type Props = NativeStackScreenProps<MembershipStackParamList, typeof ROUTES.MAIN.SUSPENSION_REQUESTS>;

export const SuspensionRequestsScreen: React.FC<Props> = ({ route }) => {
  const { colors, isDark } = useTheme();
  const { subscriptionId } = route.params;

  const [activeTab, setActiveTab] = useState<'DIRECT' | 'REQUESTS'>('DIRECT');

  const { data: requests, isLoading: isLoadingRequests, isError: isErrorRequests } = useSuspensionRequests(subscriptionId);
  const { data: directSuspensions, isLoading: isLoadingDirect, isError: isErrorDirect } = useDirectSuspensions(subscriptionId);

  const { mutateAsync: createRequest, isPending: isCreatingRequest } = useCreateSuspensionRequest();
  const { mutateAsync: cancelRequest, isPending: isCanceling } = useCancelSuspensionRequest(subscriptionId);

  const { mutateAsync: createDirect, isPending: isCreatingDirect } = useCreateDirectSuspension();
  const { mutateAsync: resumeDirect, isPending: isResuming } = useResumeDirectSuspension();

  const { data: policy } = useSuspensionPolicy();

  const minNoticeMs = (policy?.minNoticeHours ?? 48) * 60 * 60 * 1000;
  const minDurationMs = (policy?.minDurationDays ?? 7) * 24 * 60 * 60 * 1000;

  const [isModalVisible, setModalVisible] = useState(false);

  const [statusModalConfig, setStatusModalConfig] = useState<{
    visible: boolean;
    type: StatusModalType;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
  }>({
    visible: false,
    type: 'error',
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const hideStatusModal = () => setStatusModalConfig(prev => ({ ...prev, visible: false }));

  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  const defaultStartDate = new Date(Date.now() + minNoticeMs);
  const defaultEndDate = new Date(defaultStartDate.getTime() + minDurationMs);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [justificationUri, setJustificationUri] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE_VALIDATION': return colors.warning;
      case 'ACCEPTEE': return colors.success;
      case 'REFUSEE': return colors.error;
      case 'ANNULEE': return colors.textMuted;
      case 'PENDING': return '#3B82F6';
      case 'ACTIVE': return colors.success;
      case 'COMPLETED': return colors.primaryMid;
      case 'CANCELLED': return colors.textMuted;
      default: return colors.textSecondary;
    }
  };

  const getDisplayStatus = (status: string, isDirect: boolean) => {
    if (isDirect && status === 'PENDING') return 'SCHEDULED';
    if (!isDirect && status === 'EN_ATTENTE_VALIDATION') return 'PENDING APPROVAL';
    if (!isDirect && status === 'ACCEPTEE') return 'APPROVED';
    if (!isDirect && status === 'REFUSEE') return 'REJECTED';
    if (!isDirect && status === 'ANNULEE') return 'CANCELLED';
    return status.replace(/_/g, ' ');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setJustificationUri(result.assets[0].uri);
    }
  };

  const handleCancel = (requestId: string) => {
    setStatusModalConfig({
      visible: true,
      type: 'confirm',
      title: 'Cancel Request',
      message: 'Are you sure you want to cancel this suspension request?',
      confirmText: 'Yes, Cancel',
      onConfirm: async () => {
        try {
          await cancelRequest(requestId);
          setStatusModalConfig({
            visible: true,
            type: 'success',
            title: 'Cancelled',
            message: 'Request has been cancelled successfully.',
            onConfirm: hideStatusModal,
            confirmText: 'OK',
          });
        } catch (error) {
          setStatusModalConfig({
            visible: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to cancel the request.',
            onConfirm: hideStatusModal,
            confirmText: 'OK',
          });
        }
      }
    });
  };

  const handleResumeEarly = () => {
    setStatusModalConfig({
      visible: true,
      type: 'confirm',
      title: 'Resume Subscription',
      message: 'Are you sure you want to resume your subscription right now? This will end your suspension early.',
      confirmText: 'Yes, Resume',
      onConfirm: async () => {
        try {
          await resumeDirect(subscriptionId);
          setStatusModalConfig({
            visible: true,
            type: 'success',
            title: 'Resumed',
            message: 'Your subscription has been resumed successfully.',
            onConfirm: hideStatusModal,
            confirmText: 'OK',
          });
        } catch (error: any) {
          setStatusModalConfig({
            visible: true,
            type: 'error',
            title: 'Error',
            message: error.response?.data?.message || 'Failed to resume subscription.',
            onConfirm: hideStatusModal,
            confirmText: 'OK',
          });
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (startDate >= endDate) {
      setStatusModalConfig({
        visible: true,
        type: 'error',
        title: 'Validation Error',
        message: 'End date must be after the start date.',
        onConfirm: hideStatusModal,
        confirmText: 'OK'
      });
      return;
    }

    if (activeTab === 'DIRECT') {
      try {
        await createDirect({
          subscriptionId,
          payload: {
            date_debut: startDate.toISOString(),
            date_fin: endDate.toISOString(),
          }
        });
        setModalVisible(false);
        setStatusModalConfig({
          visible: true,
          type: 'success',
          title: 'Success',
          message: 'Suspension created successfully.',
          onConfirm: hideStatusModal,
          confirmText: 'OK'
        });
      } catch (error: any) {
        const errorData = error.response?.data;
        const msg = errorData?.message || 'Failed to create suspension.';
        const details = errorData?.errors ? JSON.stringify(errorData.errors) : '';
        setStatusModalConfig({
          visible: true,
          type: 'error',
          title: 'Error',
          message: details ? `${msg}\n${details}` : msg,
          onConfirm: hideStatusModal,
          confirmText: 'OK'
        });
      }
      return;
    }

    if (!reason.trim()) {
      setStatusModalConfig({
        visible: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a reason for the suspension.',
        onConfirm: hideStatusModal,
        confirmText: 'OK'
      });
      return;
    }

    if (!justificationUri) {
      setStatusModalConfig({
        visible: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please upload a justification document.',
        onConfirm: hideStatusModal,
        confirmText: 'OK'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('requestedStartDate', startDate.toISOString());
      formData.append('requestedEndDate', endDate.toISOString());
      formData.append('reason', reason);
      if (comment) formData.append('comment', comment);

      if (justificationUri) {
        const filename = justificationUri.split('/').pop() || 'justification.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('document', {
          uri: justificationUri,
          name: filename,
          type,
        } as any);
      }

      await createRequest({ subscriptionId, formData });
      setModalVisible(false);

      setReason('');
      setComment('');
      setJustificationUri(null);

      setStatusModalConfig({
        visible: true,
        type: 'success',
        title: 'Success',
        message: 'Request submitted successfully.',
        onConfirm: hideStatusModal,
        confirmText: 'OK'
      });
    } catch (error: any) {
      console.log('Submission failed error:', error);
      const errorData = error.response?.data;
      const msg = errorData?.message || error.message || 'Failed to submit request.';
      const details = errorData?.errors ? JSON.stringify(errorData.errors) : '';
      setStatusModalConfig({
        visible: true,
        type: 'error',
        title: 'Submission Error',
        message: details ? `${msg}\n${details}` : msg,
        onConfirm: hideStatusModal,
        confirmText: 'OK'
      });
    }
  };

  const renderInfoBanner = () => {
    if (activeTab === 'DIRECT') {
      return (
        <View style={[styles.infoBanner, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1), borderColor: colors.primaryMid }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color={colors.primaryMid} />
            <Text style={[styles.infoTitle, { color: colors.primaryMid }]}>Direct Suspension Rules</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textPrimary }]}>• <Text style={styles.boldText}>No admin approval</Text> is required.</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Allowed up to <Text style={styles.boldText}>{policy?.maxSuspensionsPerYear ?? 2} time(s) per year</Text>.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Request must be submitted at least <Text style={styles.boldText}>{policy?.minNoticeHours ?? 48} hours</Text> in advance.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Duration must be between <Text style={styles.boldText}>{policy?.minDurationDays ?? 7} and {policy?.maxDurationDays ?? 30} days</Text>.
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.infoBanner, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1), borderColor: colors.primaryMid }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="alert-circle" size={20} color={colors.primaryMid} />
            <Text style={[styles.infoTitle, { color: colors.primaryMid }]}>Special Requests</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textPrimary }]}>• For exceptional cases (e.g. medical) exceeding your normal quota.</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>• Requires <Text style={styles.boldText}>Admin approval</Text> to take effect.</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>• Highly recommended to attach <Text style={styles.boldText}>proof documents</Text>.</Text>
        </View>
      );
    }
  };

  const isLoading = activeTab === 'DIRECT' ? isLoadingDirect : isLoadingRequests;
  const isError = activeTab === 'DIRECT' ? isErrorDirect : isErrorRequests;
  const data = activeTab === 'DIRECT' ? directSuspensions : requests;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>

      <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'DIRECT' && { backgroundColor: colors.primaryMid }]}
          onPress={() => setActiveTab('DIRECT')}
        >
          <Text style={[styles.tabText, activeTab === 'DIRECT' ? { color: colors.white } : { color: colors.textSecondary }]}>
            🔒 Standard Freeze
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'REQUESTS' && { backgroundColor: colors.primaryMid }]}
          onPress={() => setActiveTab('REQUESTS')}
        >
          <Text style={[styles.tabText, activeTab === 'REQUESTS' ? { color: colors.white } : { color: colors.textSecondary }]}>
            📋 Special Request
          </Text>
        </TouchableOpacity>
      </View>

      {renderInfoBanner()}

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryMid} />
        </View>
      )}
      {isError && !isLoading && (
        <View style={styles.centered}>
          <Text style={{ color: colors.error, fontFamily: Theme.Typography.fontFamily.medium }}>
            Failed to load data
          </Text>
        </View>
      )}
      {!isLoading && !isError && (
        <FlatList
          data={data as any[]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {activeTab === 'DIRECT'
                  ? 'No active or past freezes yet.\nTap + to freeze your subscription.'
                  : 'No special requests submitted yet.\nTap + to request an exception.'}
              </Text>
            </View>
          }
          renderItem={({ item }: { item: any }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.reasonTitle, { color: colors.textPrimary }]}>
                  {activeTab === 'DIRECT'
                    ? '❄️ Subscription Freeze'
                    : (item.reason || 'Special Suspension Request')}
                </Text>
                <View style={[styles.badge, { backgroundColor: hexToRGBA(getStatusColor(item.status), 0.1) }]}>
                  <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
                    {getDisplayStatus(item.status, activeTab === 'DIRECT')}
                  </Text>
                </View>
              </View>

              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {new Date(item.startDate || item.requestedStartDate).toLocaleDateString()} - {new Date(item.plannedEndDate || item.requestedEndDate).toLocaleDateString()}
              </Text>

              {item.comment && (
                <Text style={[styles.commentText, { color: colors.textSecondary }]} numberOfLines={2}>
                  "{item.comment}"
                </Text>
              )}

              {activeTab === 'REQUESTS' && item.status === 'EN_ATTENTE_VALIDATION' && (
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.error + '40' }]}
                  onPress={() => handleCancel(item.id)}
                  disabled={isCanceling}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.error }]}>Cancel Request</Text>
                </TouchableOpacity>
              )}

              {activeTab === 'DIRECT' && item.status === 'ACTIVE' && (
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: colors.success + '40' }]}
                  onPress={handleResumeEarly}
                  disabled={isResuming}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.success }]}>Resume Early</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primaryMid }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {activeTab === 'DIRECT' ? '❄️ Freeze Subscription' : '📋 Special Suspension'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date</Text>
                <TouchableOpacity style={[styles.dateBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => setShowStartPicker(true)}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primaryMid} style={{ marginRight: 8 }} />
                  <Text style={{ color: colors.textPrimary, fontFamily: Theme.Typography.fontFamily.medium }}>{startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(_, selected) => { setShowStartPicker(false); if (selected) setStartDate(selected); }}
                  />
                )}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>End Date</Text>
                <TouchableOpacity style={[styles.dateBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => setShowEndPicker(true)}>
                  <Ionicons name="calendar-outline" size={18} color={colors.primaryMid} style={{ marginRight: 8 }} />
                  <Text style={{ color: colors.textPrimary, fontFamily: Theme.Typography.fontFamily.medium }}>{endDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    minimumDate={startDate}
                    onChange={(_, selected) => { setShowEndPicker(false); if (selected) setEndDate(selected); }}
                  />
                )}
              </View>
            </View>

            {activeTab === 'REQUESTS' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Reason *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                    value={reason}
                    onChangeText={setReason}
                    placeholder="E.g., Medical, Travel, Family emergency"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Comment (Optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, height: 80, textAlignVertical: 'top' }]}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    placeholder="Provide details for the admin to review your request..."
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Justification Document *</Text>
                  <TouchableOpacity
                    style={[
                      styles.uploadBtn,
                      {
                        borderColor: justificationUri ? colors.success : colors.primaryMid,
                        backgroundColor: hexToRGBA(justificationUri ? colors.success : colors.primaryMid, 0.05)
                      }
                    ]}
                    onPress={pickImage}
                  >
                    <Ionicons
                      name={justificationUri ? "checkmark-circle-outline" : "cloud-upload-outline"}
                      size={24}
                      color={justificationUri ? colors.success : colors.primaryMid}
                    />
                    <Text style={{ color: justificationUri ? colors.success : colors.primaryMid, marginLeft: 8, fontFamily: Theme.Typography.fontFamily.bold }}>
                      {justificationUri ? 'Change Document' : 'Upload File (PDF, JPG, PNG)'}
                    </Text>
                  </TouchableOpacity>
                  {justificationUri && (
                    <View style={styles.fileSelectedContainer}>
                      <Ionicons name="document-attach-outline" size={16} color={colors.success} />
                      <Text style={[styles.fileText, { color: colors.success }]}>Document attached successfully</Text>
                    </View>
                  )}
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primaryMid, opacity: (isCreatingRequest || isCreatingDirect) ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={isCreatingRequest || isCreatingDirect}
            >
              {(isCreatingRequest || isCreatingDirect) ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitBtnText}>Submit</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusModal
        visible={statusModalConfig.visible}
        type={statusModalConfig.type}
        title={statusModalConfig.title}
        message={statusModalConfig.message}
        onConfirm={statusModalConfig.onConfirm}
        onClose={hideStatusModal}
        confirmText={statusModalConfig.confirmText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsContainer: { flexDirection: 'row', padding: 8, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabText: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.bold },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 100, gap: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, fontFamily: Theme.Typography.fontFamily.medium },
  card: { padding: 16, borderRadius: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  reasonTitle: { fontSize: 18, fontFamily: Theme.Typography.fontFamily.bold, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontFamily: Theme.Typography.fontFamily.bold },
  dateText: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.medium, marginBottom: 8 },
  commentText: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.regular, fontStyle: 'italic' },
  cancelBtn: { marginTop: 16, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.bold },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontFamily: Theme.Typography.fontFamily.bold, letterSpacing: -0.3 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.bold, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderRadius: 12, borderWidth: 1.5, padding: 14, fontSize: 16, fontFamily: Theme.Typography.fontFamily.regular },
  dateBtn: { borderRadius: 12, borderWidth: 1.5, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { flexDirection: 'row', borderRadius: 12, padding: 16, borderWidth: 1.5, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  fileSelectedContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  fileText: { fontSize: 13, fontFamily: Theme.Typography.fontFamily.bold, marginLeft: 6 },
  submitBtn: { borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  submitBtnText: { color: 'white', fontSize: 16, fontFamily: Theme.Typography.fontFamily.bold },
  infoBanner: { padding: 16, marginHorizontal: 16, marginVertical: 16, borderRadius: 12, borderWidth: 1 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoTitle: { fontSize: 16, fontFamily: Theme.Typography.fontFamily.bold, marginLeft: 6 },
  infoText: { fontSize: 13, fontFamily: Theme.Typography.fontFamily.medium, marginBottom: 4, lineHeight: 20 },
  boldText: { fontFamily: Theme.Typography.fontFamily.bold }
});
