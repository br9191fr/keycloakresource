// from res.json(verifiedJwt);
var result = {
    "exp": 1605612480,
    "iat": 1605612180,
    "auth_time": 1605603660,
    "jti": "a4ad9042-af55-4ade-857a-9ebff0b87408",
    "iss": "http://localhost:8180/auth/realms/AuthSrvTest",
    "aud": ["vueclient", "account"],
    "sub": "09a47092-43d5-4a2e-9ff9-fa14f706bc45",
    "typ": "Bearer",
    "azp": "vueclient1",
    "nonce": "cb5712cc-ce0f-4d61-84c5-e7d912b054eb",
    "session_state": "ccfd8f34-06fe-4b97-857a-958650699808",
    "acr": "0",
    "allowed-origins": ["http://localhost:8080"],
    "realm_access": {"roles": ["app", "offline_access", "uma_authorization"]},
    "resource_access": {
        "vueclient": {"roles": ["app"]},
        "account": {"roles": ["manage-account", "manage-account-links", "view-profile"]}
    },
    "scope": "openid profile email",
    "email_verified": true,
    "preferred_username": "bricci",
    "email": "brricci@orange.fr"
}
// from res.json(data)
var result1 = {
    "header": {"alg": "RS256", "typ": "JWT", "kid": "EGDV1f86qHK4qygL5SGgHRflcdNg-k7RCUPHG_jK76Y"},
    "payload": {
        "exp": 1605612887,
        "iat": 1605612587,
        "auth_time": 1605603660,
        "jti": "9ab66f64-9c46-43cc-b82a-b016b5b1ebf9",
        "iss": "http://localhost:8180/auth/realms/AuthSrvTest",
        "aud": ["vueclient", "account"],
        "sub": "09a47092-43d5-4a2e-9ff9-fa14f706bc45",
        "typ": "Bearer",
        "azp": "vueclient1",
        "nonce": "8dd258ba-2b4a-46ea-a39f-85992525b2af",
        "session_state": "ccfd8f34-06fe-4b97-857a-958650699808",
        "acr": "0",
        "allowed-origins": ["http://localhost:8080"],
        "realm_access": {"roles": ["app", "offline_access", "uma_authorization"]},
        "resource_access": {
            "vueclient": {"roles": ["app"]},
            "account": {"roles": ["manage-account", "manage-account-links", "view-profile"]}
        },
        "scope": "openid profile email",
        "email_verified": true,
        "preferred_username": "bricci",
        "email": "brricci@orange.fr"
    },
    "signature": "T5_3ykF5o3S4mFhXnK6oTa_eSkPfTkEhyQWV2McLin1_rqqWExeM1Vo0bmrEqcUS23D_i0DzINrJINzj0XBA_aaxYaI9v-lJs7F5haws7Bm2eAfwbANgJkcXRKC8MNOuk4DdKVlPBfIXlM5MdVp4G8ThhMguXjByPvZ7Pb2DQnK8lFI89HOnURKRFe6E0Xgdr_1r6LeaOEcFXQrMElJNQ1QI782XStSsAYyjgy9oZb5Zbellx74vipx-G7LSy5dcJVYFCWKe-UR2UWnRGKLXuRa21jpSHRAU1nyY6SY9WQCaV96E7EurLJEi8I6F5hWvIoYT_iUNuT9WCcdYSYZOHA"
}