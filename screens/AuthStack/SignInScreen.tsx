import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { getAuth, signInWithEmailAndPassword , sendPasswordResetEmail} from "firebase/auth"; 
import firebase from "firebase/app";
import "firebase/firestore";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  const onDismissSnackBar = () => setVisible(false);
  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Content title="Sign In" />
      </Appbar.Header>
    );
  };

  const resetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent!");
        setVisible(true)
        setSnackBarText("Password reset email sent!");
      })
      .catch(error => {
        setVisible(true);
        if (error.code === "auth/user-not-found") {
          console.log("User not found!");
          setSnackBarText("User not found!");
        }
      });
  }

  const signIn = () => {
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      setLoading(false)
      console.log('User account created & signed in!');
    })
    .catch(error => {
      setLoading(false);
      setVisible(true);
      if (error.code ===  'auth/invalid-email') {
        console.log('Email not found! Please create an account!');
        setSnackBarText('Email not found! Please create an account!!');
      }
  
      if (error.code === 'auth/wrong-password') {
        console.log('Wrong password!');
        setSnackBarText('Wrong password! Please try again.');
      }
      console.log(error)
   
    });
  }

  return (
    <>
   <Bar />

      <SafeAreaView style={styles.container}>
      <TextInput
          label="Email"
          value={email}
          onChangeText={(name) => setEmail(name)}
          style={{ backgroundColor: "white", marginTop: 30, marginBottom: 20, marginLeft: 25, marginRight: 25}}
          autoComplete={false}
        />
        <TextInput
          label="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={(location) => setPassword(location)}
          style={{ backgroundColor: "white", marginBottom: 30, marginLeft: 25, marginRight: 25 }}
          autoComplete={false}
        />
        <Button
          mode="contained"
          style={{ marginTop: 10, marginLeft: 25, marginRight: 25, padding: 7 }}
          loading={loading}
          onPress = {signIn}
        >
          SIGN IN
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate("SignUpScreen")}
          style={{ marginTop: 20, marginLeft: 25, marginRight: 25, padding: 7 }}
        >
          CREATE AN ACCOUNT
        </Button>
        <Button
          mode="text"
          color="grey"
          onPress = {resetPassword}
          style={{ marginLeft: 25, marginRight: 25}}
        >
          RESET PASSWORD
        </Button>
        <Snackbar style = {{marginBottom: 30}} visible={visible} onDismiss={onDismissSnackBar}>{snackBarText} </Snackbar>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});
