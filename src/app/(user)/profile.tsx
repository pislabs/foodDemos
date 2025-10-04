import { supabase } from "@/lib/supabase";
import { Button, Text, View } from "react-native";

const ProfileScreen = () => {
  return (
    <View>
      <Text>profile</Text>
      <Button
        title="Sign out"
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      />
    </View>
  );
};

export default ProfileScreen;
