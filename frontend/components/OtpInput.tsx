import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Keyboard } from 'react-native';

type OtpInputProps = {
  code: string;
  setCode: (code: string) => void;
  maximumLength: number;
  setIsPinReady: (ready: boolean) => void;
  error?: string | null;
  onResendOtp?: () => void;
  resendOtpText?: string;
};

const OtpInput = ({
  code,
  setCode,
  maximumLength,
  setIsPinReady,
  error,
  onResendOtp,
  resendOtpText = 'Resend OTP',
}: OtpInputProps) => {
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current?.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    // Update pin ready status
    setIsPinReady(code.length === maximumLength);
    // Clean up function
    return () => {
      setIsPinReady(false);
    };
  }, [code]);

  const boxArray = new Array(maximumLength).fill(0);

  const boxDigit = (_: any, index: number) => {
    const emptyInput = '';
    const digit = code[index] || emptyInput;

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1 && code.length === maximumLength;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

    return (
      <View
        key={index}
        style={[
          styles.splitBoxes,
          isInputBoxFocused && isValueFocused ? styles.splitBoxesFocused : {},
          error ? styles.splitBoxesError : {},
        ]}
      >
        <Text style={styles.splitBoxText}>{digit}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.splitOTPBoxesContainer} onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </TouchableOpacity>

      <TextInput
        style={styles.textInputHidden}
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        keyboardType="number-pad"
        ref={inputRef}
        onBlur={handleOnBlur}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {onResendOtp && (
        <TouchableOpacity onPress={onResendOtp} style={styles.resendContainer}>
          <Text style={styles.resendText}>{resendOtpText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  splitOTPBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  splitBoxes: {
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    minWidth: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splitBoxesFocused: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  splitBoxesError: {
    borderColor: '#ff3b30',
  },
  splitBoxText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  textInputHidden: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OtpInput;
