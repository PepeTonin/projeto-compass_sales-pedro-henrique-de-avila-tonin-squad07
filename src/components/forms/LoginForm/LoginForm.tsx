import { useState, useEffect, useContext } from 'react';
import { Alert, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { styles } from './style';
import ActionRouteButton from '../../ActionRouteButton/ActionRouteButton';
import SuccessRouteButton from '../../SuccessRouteButton/SuccessRouteButton';
import UserInput from '../../UserInput/UserInput';
import { getUserNameByUid } from '../../../util/userData';
import { login } from '../../../util/auth';
import { AuthContext } from '../../../context/auth-context';
import {
  emailValidation,
  passwordValidation,
} from '../../../util/inputValidations';

type RootStackParamList = {
  Login: any;
  SignUp: any;
  ForgotPassword: any;
  AuthRoutes: any;
};

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

export default function LoginForm({ navigation }: NavigationProps) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [isEmailEmpty, setIsEmailEmpty] = useState(true);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const setIsSubmittedToFalseWhenScreenRenders = navigation.addListener(
      'focus',
      () => {
        setIsSubmitted(false);
        setEnteredEmail('');
        setIsEmailEmpty(true);
        setEnteredPassword('');
        setIsPasswordEmpty(true);
      }
    );
    return setIsSubmittedToFalseWhenScreenRenders;
  }, [navigation]);

  function forgotPasswordHandler() {
    navigation.navigate('ForgotPassword');
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

  function updateEnteredPasswordHandler(enteredValue: string) {
    setEnteredPassword(enteredValue);

    if (passwordValidation(enteredValue)) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }

    if (enteredValue.length > 0) {
      setIsPasswordEmpty(false);
    } else {
      setIsPasswordEmpty(true);
    }

    setIsSubmitted(false);
  }

  async function loginHandler() {
    setIsSubmitted(true);
    if (isEmailValid && isPasswordValid) {
      try {
        const { token, uid } = await login(enteredEmail, enteredPassword);
        let name = await getUserNameByUid(uid);
        authContext.authenticate(token, name);
      } catch (error) {
        Alert.alert(
          'Authentication failed!',
          'Could not login, please check your email and password or try again later.'
        );
      }
    }
  }

  return (
    <>
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
        <UserInput
          type="password"
          placeholder="Password"
          onChangeText={updateEnteredPasswordHandler}
          value={enteredPassword}
          isValid={isPasswordValid}
          isEmpty={isPasswordEmpty}
          isSubmitted={isSubmitted}
        />
      </View>
      <View style={styles.textContainer}>
        <ActionRouteButton onPress={forgotPasswordHandler}>
          Forgot your password?
        </ActionRouteButton>
      </View>
      <View style={styles.buttonContainer}>
        <SuccessRouteButton onPress={loginHandler}>LOGIN</SuccessRouteButton>
      </View>
    </>
  );
}
