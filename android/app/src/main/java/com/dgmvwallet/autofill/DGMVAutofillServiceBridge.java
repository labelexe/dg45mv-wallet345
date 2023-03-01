package com.dgmvwallet.autofill;

import android.service.autofill.Dataset;
import android.service.autofill.FillRequest;
import android.service.autofill.FillResponse;
import android.util.Log;
import android.view.autofill.AutofillId;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;

import org.jetbrains.annotations.NotNull;

public class DGMVAutofillServiceBridge {
    public interface CompletionHandler {
        void requestCompleted(FillResponse fillResponse);
        void requestCancelled(String reason);
    }

    private static DGMVAutofillServiceBridge instance = null;
    private CredentialProviderRequest credentialProviderRequestInstance;

    private String websiteURL = "";
    private boolean startExtension = false;

    private RequestInfo requestInfo;
    private CompletionHandler completionHandler;

    public class RequestInfo {
        private boolean startExtension = false;
        private String websiteURL;
        private AutofillId usernameFieldId;
        private AutofillId passwordFieldId;

        RequestInfo() {
            this.startExtension = false;
        }

        RequestInfo(DGMVAutofillParser parser) {
            this.startExtension = true;
            this.websiteURL = parser.getURL();
            this.usernameFieldId = parser.getUsernameId();
            this.passwordFieldId = parser.getPasswordId();
        }

        RequestInfo(String websiteURL) {
            this.startExtension = true;
            this.websiteURL = websiteURL;
        }

        RequestInfo(RequestInfo other) {
            this.startExtension = other.startExtension;
            this.websiteURL = other.websiteURL;
        }

        protected void setConsumed() {
            this.startExtension = false;
            this.websiteURL = null;
            this.usernameFieldId = null;
            this.passwordFieldId = null;
        }

        public boolean willStartExtension() {
            return this.startExtension;
        }

        public boolean hasURL() {
            return (this.websiteURL != null && !this.websiteURL.isEmpty());
        }

        @NotNull
        public String getURL() {
            return this.websiteURL;
        }

        @Override
        public String toString() {
            return "RequestInfo{" +
                    "startExtension=" + startExtension +
                    ", websiteURL='" + websiteURL + '\'' +
                    ", usernameFieldId=" + usernameFieldId +
                    ", passwordFieldId=" + passwordFieldId +
                    '}';
        }
    }

    protected DGMVAutofillServiceBridge() {
        requestInfo = new RequestInfo();
    }

    private static String packageName;

    public static void setPackageName(String packageName) {
        DGMVAutofillServiceBridge.packageName = packageName;
    }

    public static String getPackageName() {
        return packageName;
    }

    public static DGMVAutofillServiceBridge getInstance() {
        if (DGMVAutofillServiceBridge.packageName == null) {
            throw new RuntimeException("Package Name not set");
        }

        if (instance == null) {
            instance = new DGMVAutofillServiceBridge();
        }
        return instance;
    }

    public void setCredentialProviderRequestInstance(CredentialProviderRequest instance) {
        this.credentialProviderRequestInstance = instance;
    }

    public CredentialProviderRequest getCredentialProviderRequestInstance() {
        return credentialProviderRequestInstance;
    }

    public void prepareToStartExtension(DGMVAutofillParser parser) {
        // Save request info
        requestInfo = new RequestInfo(parser);
    }

    /*
    private AutofillRequestResult createResult() {

    }
    */

    public void requestCompleted(String username, String password) {
        if (completionHandler == null) throw new RuntimeException("No completionHandler registered");

        Log.d("DGMV-Autofill", requestInfo.toString());

        boolean hasUsername = requestInfo.usernameFieldId != null && username != null && !username.isEmpty();
        String packageName = DGMVAutofillServiceBridge.packageName;
        Dataset.Builder builder = new Dataset.Builder();

        // Build the presentation of the datasets.
        if (hasUsername) {
            RemoteViews usernamePresentation = new RemoteViews(packageName, android.R.layout.simple_list_item_1);
            usernamePresentation.setTextViewText(android.R.id.text1, username);

            builder.setValue(
                    requestInfo.usernameFieldId,
                    AutofillValue.forText(username),
                    usernamePresentation
            );
        }

        // Build password description for presentation
        String passwordDescription = "Password for ";
        if (hasUsername) {
            passwordDescription += username;
        } else if (requestInfo.hasURL()) {
            passwordDescription += requestInfo.getURL();
        } else {
            passwordDescription = "Generated Password";
        }

        // Return generated password
        RemoteViews passwordPresentation = new RemoteViews(packageName, android.R.layout.simple_list_item_1);
        passwordPresentation.setTextViewText(android.R.id.text1, passwordDescription);

        builder.setValue(
                requestInfo.passwordFieldId,
                AutofillValue.forText(password),
                passwordPresentation
        );

        FillResponse fillResponse = new FillResponse.Builder()
                .addDataset(builder.build())
                .build();

        completionHandler.requestCompleted(fillResponse);
    }

    public void requestCancelled(String reason) {
        if (completionHandler == null) throw new RuntimeException("No completionHandler registered");
        completionHandler.requestCancelled(reason);
    }

    public void registerCompletionHandler(CompletionHandler handler) {
        this.completionHandler = handler;
    }

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }
}
