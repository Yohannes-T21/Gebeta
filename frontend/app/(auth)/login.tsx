import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

const countries: Country[] = [
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
];

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [responseType, setResponseType] = useState<'success' | 'error'>('success');

  const router = useRouter();

  const validateForm = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setResponseMessage('');
    const cleanedNumber = phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
    const formattedPhone = `${selectedCountry.dialCode}${cleanedNumber}`.replace('+', '');

    try {
      const response = await fetch('https://gebeta-delivery1.onrender.com/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();
      console.log('✅ Server response:', data);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send OTP');
      }

      setResponseMessage('✅ OTP sent successfully!');
      setResponseType('success');
      setShowResponse(true);

      setTimeout(() => {
        setShowResponse(false);
        router.push({
          pathname: '/(auth)/verify',
          params: { phone: formattedPhone },
        });
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error sending OTP:', error.message);
      setPhoneError(error.message || 'Failed to send OTP');
      setResponseMessage(`❌ ${error.message}`);
      setResponseType('error');
      setShowResponse(true);

      setTimeout(() => setShowResponse(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const renderCountryItem = (country: Country) => (
    <TouchableOpacity
      key={country.code}
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(country);
        setShowCountryPicker(false);
      }}
    >
      <Text style={styles.flag}>{country.flag}</Text>
      <Text style={styles.countryName}>{country.name}</Text>
      <Text style={styles.dialCode}>{country.dialCode}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullScreen}>
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {showResponse && (
            <View
              style={[
                styles.responseBanner,
                responseType === 'success' ? styles.successBanner : styles.errorBanner,
              ]}
            >
              <Text style={styles.responseText}>{responseMessage}</Text>
            </View>
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              style={styles.scrollView}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeText}>Welcome to Gebeta</Text>
                <Text style={styles.subtitleText}>Delicious food delivered to your door</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Enter Your Phone Number</Text>
                <Text style={styles.cardSubtitle}>We'll send you a verification code</Text>

                <View style={styles.phoneInputContainer}>
                  <TouchableOpacity
                    style={styles.countryPicker}
                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                  >
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>

                  <TextInput
                    style={[styles.input, phoneError ? styles.inputError : null]}
                    placeholder="Phone number"
                    placeholderTextColor="transparent"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>

                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                {showCountryPicker && (
                  <View style={styles.countryList}>{countries.map(renderCountryItem)}</View>
                )}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRightWidth: 0,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  dialCodeText: {
    fontSize: 16,
    color: '#333',
    marginRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftWidth: 0,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  button: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  linkText: {
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  countryList: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 4,
    overflow: 'hidden',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  dialCode: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  responseBanner: {
    padding: 12,
    borderRadius: 8,
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  successBanner: {
    backgroundColor: '#4BB543', // Green
  },
  errorBanner: {
    backgroundColor: '#FF4C4C', // Red
  },
  responseText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
