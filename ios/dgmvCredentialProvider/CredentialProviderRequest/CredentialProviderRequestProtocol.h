//
//  CredentialProviderRequestDelegate.h
//  DGMV Authenticator Credential Provider
//
//  Created by Julian Jäger on 23.02.22.
//  Copyright © 2022 DigiCorp Labs. All rights reserved.
//

@protocol CredentialProviderRequestProtocol
typedef void(^AutoFillIsEnabledCallback)(BOOL isEnabled);
@required
- (void) generatedCredentials:(NSString*) username withPassword: (NSString*) password;
- (void) cancelledRequest:(NSString*) reason;
- (void) autofillIsEnabled:(void (^)(BOOL)) completionBlock;
@end

//protocol AuthenticationRequestDelegate {
//  func generatedCredentials(with username: String, password: String)
//  func cancelledRequest(reason: String)
//}

