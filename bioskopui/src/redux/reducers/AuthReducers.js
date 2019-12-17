// //#9
const INITIAL_STATE = { // //buat state awal yang berisikan parameter dari user, dengan status login masih false
    id: 0,
    username: '',
    password: '',
    login: false,
    error: '',
    loading: false,
    role: '',
    notif: 0,
    keranjang: 0,
    totalharga: 0
}

export default (state = INITIAL_STATE, action) => { // //export reducer dengan parameter state, serta actionnya
    switch (action.type) { // //buat metode switch berdasarkan type dari action
        case 'LOGIN_SUCCESS': // //jika type nya Login
            return { ...state, ...action.payload, login: true, loading: false, error: "" } // //akan mereturn isi seluruh state (yang diisi), actionnya, serta status login menjadi true
        case 'LOGOUT_SUCCESS':
            return INITIAL_STATE
        case 'LOGIN_ERROR':
            return { ...state, error: action.payload, loading: false }
        case "RESET_PASS":
            return { ...state, ...action.payload };
        case 'TOTAL_HARGA':
            return { ...state, totalharga: action.payload }
        case 'COUNT_CART':
            return { ...state, keranjang: action.payload }
        case "LOGOUT":
            return INITIAL_STATE;
        default: // //jika tidak, maka akan mengembalikan state awal (Initial State) / gagal login
            return state
    }
}