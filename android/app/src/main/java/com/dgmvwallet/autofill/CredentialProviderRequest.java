package com.dgmvwallet.autofill;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.view.autofill.AutofillManager;
import android.util.Log;

public class CredentialProviderRequest extends ReactContextBaseJavaModule {
    CredentialProviderRequest(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "CredentialProviderRequest";
    }

    @ReactMethod
    public void askForPermissions() {
        Activity activity = getCurrentActivity();

        AutofillManager service = activity.getSystemService(AutofillManager.class);
        if (service.isAutofillSupported() && !service.hasEnabledAutofillServices()) {
            // Open settings menu and register application
            Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE);
            intent.setData(Uri.parse("package:" + DGMVAutofillServiceBridge.getPackageName()));
            activity.startActivity(intent);
        }
    }

    @ReactMethod
    public void autofillIsEnabled(Promise promise) {
        Activity activity = getCurrentActivity();
        AutofillManager service = activity.getSystemService(AutofillManager.class);
        promise.resolve(service.hasEnabledAutofillServices());
    }

    @ReactMethod
    public void autofillIsSupported(Promise promise) {
        Activity activity = getCurrentActivity();
        AutofillManager service = activity.getSystemService(AutofillManager.class);
        promise.resolve(service.isAutofillSupported());
    }

    @ReactMethod
    public void authenticationRequestCompleted(String username, String password) {
        DGMVAutofillServiceBridge.getInstance().requestCompleted(username, password);
    }

    @ReactMethod
    public void authenticationRequestCancelled(String reason) {
        DGMVAutofillServiceBridge.getInstance().requestCancelled(reason);
    }
}