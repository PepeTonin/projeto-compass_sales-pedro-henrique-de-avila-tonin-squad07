import { useState } from 'react';
import { Text, View, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './style';
import SuccessRouteButton from '../../SuccessRouteButton/SuccessRouteButton';
import UserInput from '../../UserInput/UserInput';
import { resetPassword } from '../../../util/auth';
import LoadingOverlay from '../../LoadingOverlay/LoadingOverlay';
import { emailValidation } from '../../../util/inputValidations';

type RootStackParamList = {
  Login: any;
  SignUp: any;
  ForgotPassword: any;
  AuthRoutes: any;
};

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

export default function ForgotPasswordForm({ navigation }: NavigationProps) {
  const [enteredEmail, setEnteredEmail] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(false);

  const [isEmailEmpty, setIsEmailEmpty] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isDoingRequest, setIsDoingRequest] = useState(false);

  async function sendRequestForgotPasswordHandler() {
    setIsSubmitted(true);
    setIsDoingRequest(true);
    if (isEmailValid) {
      try {
        await resetPassword(enteredEmail);
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert(
          'Reset password failed!',
          'Email not found. Check your input.'
        );
      }
    }
    setIsDoingRequest(false);
  }

  function updateEnteredEmailHandler(enteredValue: string) {
    setEnteredEmail(enteredValue.toLowerCase());

    if (emailValidation(enteredValue)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }

    if (enteredValue.length > 0) {
      setIsEmailEmpty(false);
    } else {
      setIsEmailEmpty(true);
    }

    setIsSubmitted(false);
  }

  if (isDoingRequest) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Please, enter your email address. You will receive a link to create a
          new password via email.
        </Text>
      </View>
      <View style={styles.inputsContainer}>
        <UserInput
          type="email"
          placeholder="Email"
          onChangeText={updateEnteredEmailHandler}
          value={enteredEmail}
          isValid={isEmailValid}
          isEmpty={isEmailEmpty}
          isSubmitted={isSubmitted}
        />
      </View>
      <View style={styles.buttonContainer}>
        <SuccessRouteButton onPress={sendRequestForgotPasswordHandler}>
          SEND
        </SuccessRouteButton>
      </View>
    </>
  );
}
