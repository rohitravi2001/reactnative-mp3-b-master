import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import { User, getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/firestore";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
  */
      const [loading, setLoading] = useState(false);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [visible, setVisible] = React.useState(false);
      const [snackBarText, setSnackBarText] = React.useState("");

      const Bar = () => {
        return (
          <Appbar.Header>
            <Appbar.Content title="Create an Account" />
          </Appbar.Header>
        );
      };
    const onDismissSnackBar = () => setVisible(false);
    const createUser = () => {
      setLoading(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false)
        console.log('User account created & signed in!');
      })
      .catch(error => {
        setLoading(false);
        setVisible(true);
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          setSnackBarText('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setSnackBarText('That email address is invalid!');
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
              secureTextEntry={true}
              value={password}
              onChangeText={(location) => setPassword(location)}
              style={{ backgroundColor: "white", marginBottom: 30, marginLeft: 25, marginRight: 25 }}
              autoComplete={false}
            />
            <Button
              mode="contained"
              style={{ marginTop: 10, marginLeft: 25, marginRight: 25, padding: 7 }}
              onPress={createUser}
              loading={loading}
            >
              CREATE AN ACCOUNT
            </Button>
            <Button
              mode="text"
              style={{ marginTop: 20, marginLeft: 25, marginRight: 25, padding: 7 }}
              onPress = {() => navigation.navigate("SignInScreen")}
            >
              OR, SIGN IN INSTEAD
            </Button>
            <Snackbar style = {{marginBottom: 20}} visible={visible} onDismiss={onDismissSnackBar}>{snackBarText} </Snackbar>
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
