package com.turnup;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class IntentSender extends ReactContextBaseJavaModule {

    private static final String FB_MESSENGER_PKG = "com.facebook.orca";
    private static final String WHATSAPP_PKG = "com.whatsapp";
    private static final String INTENT_TYPE = "text/plain";

    public IntentSender(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "IntentSender";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("FB_MESSENGER", FB_MESSENGER_PKG);
        constants.put("WHATSAPP", WHATSAPP_PKG);
        return constants;
    }

    @ReactMethod
    public void sendTextToApplication(String message, String packageName) {
        final Intent sendIntent = createTargetedIntent(message, packageName);
        final ReactApplicationContext context = getReactApplicationContext();
        if (sendIntent.resolveActivity(context.getPackageManager()) != null) {
            context.runOnUiQueueThread(new Runnable(){
                public void run(){
                    context.startActivity(sendIntent);
                }
            });
        }
    }

    @ReactMethod
    public void chooseAndSendText(String message, String chooserTitle) {
        final Intent sendIntent = createChooserIntent(message, chooserTitle);
        final ReactApplicationContext context = getReactApplicationContext();
        if (sendIntent.resolveActivity(context.getPackageManager()) != null) {
            context.runOnUiQueueThread(new Runnable(){
                public void run(){
                    context.startActivity(sendIntent);
                }
            });
        }
    }

    private static Intent createTargetedIntent(String message, String packageName) {
        Intent targetedIntent = createTextIntent(message);
        targetedIntent.setPackage(packageName);
        targetedIntent.addFlags(createIntentFlags(packageName));
        return targetedIntent;
    }

    private static Intent createChooserIntent(String message, String title) {
        Intent chooserIntent = Intent.createChooser(createTextIntent(message), title);
        chooserIntent.addFlags(createIntentFlags(null));
        return chooserIntent;
    }

    private static int createIntentFlags(String packageName) {
        if (packageName != null && packageName.equalsIgnoreCase(FB_MESSENGER_PKG)) {
            return Intent.FLAG_ACTIVITY_NEW_TASK;
        }
        return Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK;
    }

    private static Intent createTextIntent(String message) {
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_SEND);
        intent.putExtra(Intent.EXTRA_TEXT, message);
        intent.setType(INTENT_TYPE);
        return intent;
    }
}
