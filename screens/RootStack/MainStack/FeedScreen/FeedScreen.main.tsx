import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Card, Button } from "react-native-paper";
import { getFirestore, collection, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { getAuth, signOut } from "firebase/auth";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // List of social objects
  const [socials, setSocials] = useState<SocialModel[]>([]);
 


  const auth = getAuth();
  const currentUserId = auth.currentUser!.uid;
  const db = getFirestore();
  const socialsCollection = collection(db, "socials");

  useEffect(() => {
    const unsubscribe = onSnapshot(query(socialsCollection, orderBy("eventDate", "asc")), (querySnapshot) => {
      var newSocials: SocialModel[] = [];
        querySnapshot.forEach((social: any) => {
          const newSocial = social.data() as SocialModel;
          newSocial.id = social.id;
          newSocials.push(newSocial);
        });
        console.log(newSocials);
        setSocials(newSocials);
      });
    return unsubscribe;
  }, []);

  const toggleInterested =  async (social: SocialModel) => {
    // TODO: Put your logic for flipping the user's "interested"
    // status here, and call this method from your "like"
    // button on each Social card.
  
    await updateDoc(doc(db, "socials", social.id) , { interested: !social.interested });


  };

  const deleteSocial =  async (social: SocialModel) => {
    // TODO: Put your logic for deleting a social here,
    // and call this method from your "delete" button
    // on each Social card that was created by this user.
    await deleteDoc(doc(db, "socials", social.id));

  };

  const renderSocial = ({ item }: { item: SocialModel }) => {
    const onPress = () => {
      navigation.navigate("DetailScreen", {
        social: item,
      });
    };
    console.log(currentUserId);
    if(currentUserId == item.userCreated) {
      return (
        <Card onPress={onPress} style={{ margin: 16 }}>
          <Card.Cover source={{ uri: item.eventImage }} />
          <Card.Title
            title={item.eventName}
            subtitle={
              item.eventLocation +
              " • " +
              new Date(item.eventDate).toLocaleString()
            }
          />
           <Card.Actions>
           <Button onPress={ () => toggleInterested(item)} icon={item.interested ? "heart" : "heart-outline"}>{item.interested ? "LIKED" : "LIKE"}</Button>
            <Button color="red" onPress = {() => deleteSocial(item)}>DELETE</Button>
          </Card.Actions>
          {/* TODO: Add a like/interested button & delete soccial button. See Card.Actions
                in React Native Paper for UI/UX inspiration.
                https://callstack.github.io/react-native-paper/card-actions.html */}
        </Card>
  
  
      );
    }
    else {
      return (
        <Card onPress={onPress} style={{ margin: 16 }}>
          <Card.Cover source={{ uri: item.eventImage }} />
          <Card.Title
            title={item.eventName}
            subtitle={
              item.eventLocation +
              " • " +
              new Date(item.eventDate).toLocaleString()
            }
          />
           <Card.Actions>
           <Button onPress={ () => toggleInterested(item)} icon={item.interested ? "heart" : "heart-outline"}>{item.interested ? "LIKED" : "LIKE"}</Button>
          </Card.Actions>
          {/* TODO: Add a like/interested button & delete soccial button. See Card.Actions
                in React Native Paper for UI/UX inspiration.
                https://callstack.github.io/react-native-paper/card-actions.html */}
        </Card>
  
  
      );
    }
    
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => signOut(auth)}
        />
        <Appbar.Content title="Socials" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("NewSocialScreen");
          }}
        />
      </Appbar.Header>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style = {{padding: 35}}>
        <Text style = {{color: "grey"}}>Welcome! To get started, use the plus button in the top-right corner to create a new social.</Text>
        </View>
      );
      }

  return (
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={socials}
          renderItem={renderSocial}
          keyExtractor={(_: any, index: number) => "key-" + index}
          // TODO: Uncomment the following line, and figure out how it works
          // by reading the documentation :)
          // https://reactnative.dev/docs/flatlist#listemptycomponent

          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </>
  );
}
