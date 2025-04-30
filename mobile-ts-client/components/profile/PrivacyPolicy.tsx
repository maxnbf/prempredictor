import React from "react";
import { SafeAreaView, ScrollView, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { privacyHtml } from "./privacyPolicyHtml";

function cleanBdtTags(htmlString: string): string {
  // Remove <bdt> tags and any attributes they may have
  return htmlString.replace(/<bdt[^>]*>/g, "").replace(/<\/bdt>/g, "");
}

export const PrivacyPolicy = () => {
  const cleanedHtml = cleanBdtTags(privacyHtml);
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView>
      <ScrollView style={{ padding: 16 }}>
        <RenderHtml contentWidth={width} source={{ html: cleanedHtml }} />
      </ScrollView>
    </SafeAreaView>
  );
};
