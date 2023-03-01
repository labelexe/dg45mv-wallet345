package com.dgmvwallet.autofill;

import android.app.assist.AssistStructure;
import android.os.Build;
import android.service.autofill.FillContext;
import android.service.autofill.FillRequest;
import android.text.InputType;
import android.util.Log;
import android.util.Pair;
import android.view.ViewStructure;
import android.view.autofill.AutofillId;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class DGMVAutofillParser {
    private FillRequest request;
    private boolean parsed;
    private boolean success;
    private String scheme;
    private String domain;

    private AutofillId usernameId;
    private AutofillId passwordId;

    DGMVAutofillParser(FillRequest request) {
        this.request = request;
        this.parsed = false;
        this.success = false;
        this.usernameId = null;
        this.passwordId = null;

        this.scheme = "https";
        this.domain = "";
    }

    protected String getNodeInfo(AssistStructure.ViewNode node, int t) {
        String intention = new String(new char[t * 2]).replace('\0', ' ');

        String info = "@DEPTH=" + t + ": " + intention;

        info += "id=" + node.getId() + ", ";

        String[] strings = node.getAutofillHints();
        if (strings != null) {
            info += "hints=" + String.join(",", strings);
        }

        // Get Hint
        String hint = node.getHint();
        if (hint != null && !hint.isEmpty())
            info += "HINT=" + hint + ", ";

        // Get Text
        CharSequence cs = node.getText();
        if (cs != null)
            info += "text=" + cs.toString() + ", ";

        // More attributes
        info += "focused=" + node.isFocused() + ", ";
        info += "focusable=" + node.isFocusable() + ", ";

        ViewStructure.HtmlInfo htmlInfo = node.getHtmlInfo();
        if (htmlInfo != null) {
            String tag = htmlInfo.getTag();
            String htmlDescription = htmlInfo.toString();
            List<Pair<String, String>> attributes = htmlInfo.getAttributes();

            if (attributes != null) {
                info += "htmlAttributes=" + attributes.size() + ", ";
            }

            if (tag != null && !tag.isEmpty())
                info += "htmlTag=" + tag + ", ";

            if (htmlDescription != null && !htmlDescription.isEmpty())
                info += "htmlDescription=" + htmlDescription + ", ";
        }

        String className = node.getClassName();
        if (className != null && !className.isEmpty())
            info += "className=" + className + ", ";

        CharSequence contentDescription = node.getContentDescription();
        if (contentDescription != null && contentDescription.length() > 0) {
            info += "cd=" + contentDescription.toString() + ", ";
        }

        info += "it=" + node.getInputType() + ", ";

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
            String textIdEntry = null;
            textIdEntry = node.getTextIdEntry();

            if (textIdEntry != null && !textIdEntry.isEmpty()) {
                info += "te=" + textIdEntry + ", ";
            }
        }

        return info;
    }

    protected boolean isUsernameField(AssistStructure.ViewNode node, String parentTextHint, int t) {
        boolean result = false;

        // Element must be focusable
        if (!node.isFocusable()) return result;

        // If a classname was given, check if it is an EditText element
        if (!"android.widget.EditText".equalsIgnoreCase(node.getClassName())) return result;

        // ToDo: Select username field according to the autofill hints using getAutoFillHints()

        // Process using hint
        String hint = node.getHint();
        if (hint == null || hint.isEmpty()) {
            if (parentTextHint != null && !parentTextHint.isEmpty()) {
                hint = parentTextHint;
            } else {
                return result;
            }
        }

        hint = hint.toLowerCase(Locale.ROOT);

        return hint.contains("user") || hint.contains("mail");
    }

    protected boolean isPasswordField(AssistStructure.ViewNode node, String parentTextHint, int t) {
        boolean result = false;

        // Element must be focusable
        if (!node.isFocusable()) return result;

        // Check if it is an EditText element
        if (!"android.widget.EditText".equalsIgnoreCase(node.getClassName())) return result;

        // ToDo: Select password field according to the autofill hints using getAutoFillHints()
        //

        // Process using hint
        String hint = node.getHint();
        if (hint == null || hint.isEmpty()) {
            if (parentTextHint == null || parentTextHint.isEmpty()) return result;
            hint = parentTextHint;
        }

        hint = hint.toLowerCase(Locale.ROOT);

        result |= hint.contains("pass");
        result |= (node.getInputType() & InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD) != 0;
        result |= (node.getInputType() & InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) != 0;
        result |= (node.getInputType() & InputType.TYPE_TEXT_VARIATION_PASSWORD) != 0;

        return result;
    }

    private void processAutoFillIdsInner(AssistStructure.ViewNode node, String parentTextHint, int t) {
        String lastTextHint = parentTextHint;

        for (int i = 0; i < node.getChildCount(); ++i) {
            AssistStructure.ViewNode childNode = node.getChildAt(i);

            // Extract webdomain (if available)
            String webDomain = childNode.getWebDomain();
            if (webDomain != null && !webDomain.isEmpty()) {
                this.domain = webDomain;

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    this.scheme = childNode.getWebScheme();
                }
            }

            // Get label description text.
            // Sometimes this is not the editText element itself, but a label
            // that is located before the input field.
            CharSequence newTextHint = childNode.getText();
            if (
                newTextHint != null &&
                newTextHint.length() > 0
            ) {
                lastTextHint = newTextHint.toString();
                Log.d("DGMV-Autofill", "newTextHint=" + lastTextHint);
            }

            // Log.d("DGMV-Autofill", getNodeInfo(childNode, t));

            // Check what type of field that is
            if (isUsernameField(childNode, lastTextHint, t)) {
                if (usernameId == null) {
                    usernameId = childNode.getAutofillId();
                    Log.d("DGMV-Autofill", "Select id=" + childNode.getId() + " as username field");
                } else {
                    Log.w("DGMV-Autofill", "Found multiple username fields, using first occurrence");
                }

            } else if (isPasswordField(childNode, lastTextHint, t)) {
                if (passwordId == null) {
                    passwordId = childNode.getAutofillId();
                    Log.d("DGMV-Autofill", "Select id=" + childNode.getId() + " as password field");
                } else {
                    Log.w("DGMV-Autofill", "Found multiple password fields, using first occurrence");
                }
            }

            // Process all child nodes recursively
            processAutoFillIdsInner(childNode, lastTextHint, t + 1);
        }
    }

    private boolean hasFocusedElement(AssistStructure.ViewNode viewNode, int t) {
        for (int i = 0; i < viewNode.getChildCount(); ++i) {
            AssistStructure.ViewNode childNode = viewNode.getChildAt(i);

            if (childNode.isFocused()) {
                return true;
            }

            if (hasFocusedElement(childNode, t + 1)) {
                return true;
            }
        }

        return false;
    }

    AssistStructure.WindowNode findFocusedWindow() {
        if (request.getFillContexts().size() > 0) {
            List<FillContext> fillContexts = request.getFillContexts();

            for (int i = 0; i < fillContexts.size(); ++i) {
                FillContext fillContext = fillContexts.get(i);
                AssistStructure structure = fillContext.getStructure();

                for (int j = 0; j < structure.getWindowNodeCount(); ++j) {
                    AssistStructure.WindowNode windowNode = structure.getWindowNodeAt(j);
                    AssistStructure.ViewNode viewNode = windowNode.getRootViewNode();
                    if (hasFocusedElement(viewNode, 0)) {
                        return windowNode;
                    }
                }
            };
        }

        return null;
    }

    public boolean parse() {
        if (parsed) return success;

        // For security reasons, we will only process the first window that we find, that has
        // focused elements such a focused textbox.
        AssistStructure.WindowNode window = findFocusedWindow();

        if (window != null) {
            AssistStructure.ViewNode viewNode = window.getRootViewNode();
            processAutoFillIdsInner(viewNode, null, 0);
            success = hasPasswordId();
        }

        parsed = true;
        return success;
    }

    public boolean hasUsernameId() {
        return usernameId != null;
    }

    public boolean hasPasswordId() {
        return passwordId != null;
    }

    public AutofillId[] getIds() {
        ArrayList<AutofillId> ids = new ArrayList<>();

        if (hasUsernameId()) ids.add(usernameId);
        if (hasPasswordId()) ids.add(passwordId);

        AutofillId[] result = new AutofillId[ids.size()];
        result = ids.toArray(result);
        return result;
    }

    public AutofillId getUsernameId() {
        return usernameId;
    }

    public AutofillId getPasswordId() {
        return passwordId;
    }

    public String getURL() {
        if (!domain.isEmpty()) {
            return scheme + "://" + domain;
        }

        return null;
    }
}
