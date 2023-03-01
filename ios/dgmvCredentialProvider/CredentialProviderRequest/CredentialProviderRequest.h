//
//  CredentialProviderRequest.h
//  DGMV Authenticator Credential Provider
//
//  Created by Julian Jäger on 23.02.22.
//  Copyright © 2022 DigiCorp Labs. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import "CredentialProviderRequestProtocol.h"

@interface CredentialProviderRequest : NSObject <RCTBridgeModule>
@property (nonatomic, weak) id<CredentialProviderRequestProtocol> delegate;
@end
