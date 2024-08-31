import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";


// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyBGQjlkmtqMNyect67dS8tzM8WBM6E1lfY",
    authDomain: "sample-d7aab.firebaseapp.com",
    projectId: "sample-d7aab",
    storageBucket: "sample-d7aab.appspot.com",
    messagingSenderId: "747403752416",
    appId: "1:747403752416:web:40aa1594ece600c853f185",
    measurementId: "G-79ZNFPPTE8",
    databaseURL: "https://sample-d7aab-default-rtdb.firebaseio.com/"
};


// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);
const dbRef = ref(db, "chat");

let selectedIcon = "ham.png"; // デフォルトのアイコンを設定

// アイコンを選択
document.querySelectorAll(".student-icon").forEach(icon => {
    icon.addEventListener("click", function() {
        // 選択されたアイコンのクラスを追加
        document.querySelectorAll(".student-icon").forEach(i => i.classList.remove("selected"));
        this.classList.add("selected");

        // 選択されたアイコンを記録
        selectedIcon = this.getAttribute("data-icon");
    });
});

// チューター先生の応答を設定
document.querySelectorAll(".subject-button").forEach(button => {
    button.addEventListener("click", function() {
        const subject = this.getAttribute("data-subject");
        const response = "チューター先生: どんな悩みですか？ (" + subject + ")";
        document.getElementById("tutor-response").textContent = response;
    });
});

// 送信ボタンのクリックイベントを設定
document.getElementById("send").addEventListener("click", function() {
    const uname = document.getElementById("uname").value;
    const date = document.getElementById("date").value;
    const text = document.getElementById("text").value;

    if (uname && date && text) {
        const msg = {
            uname: uname,
            date: date,
            text: text,
            icon: selectedIcon
        };
        const newPostRef = push(dbRef);
        set(newPostRef, msg);

        // フォームをリセット
        document.getElementById("uname").value = "";
        document.getElementById("date").value = "";
        document.getElementById("text").value = "";
    } else {
        alert("名前、日付、相談内容をすべて入力してください。");
    }
});

// Firebaseからのデータを受け取って表示
onChildAdded(dbRef, function(data) {
    const msg = data.val();
    const key = data.key;
    let h = '<div id="'+key+'" class="chat-entry">';
        h += '<img src="img/' + msg.icon + '" alt="受講生のアイコン">';
        h += '<span><strong>名前:</strong> ' + msg.uname + '</span>';
        h += '<span><strong>日付:</strong> ' + msg.date + '</span>';
        h += '<span><strong>相談内容:</strong> ' + msg.text + '</span>';
        h += '</div>';
    document.getElementById("output").insertAdjacentHTML("afterbegin", h);  // 新しいチャットを上に表示
});

// リセットボタンのクリックイベントを設定
document.getElementById("reset").addEventListener("click", function() {
    // データベースの内容をすべて削除
    remove(dbRef).then(() => {
        // 表示されているチャット履歴をクリア
        document.getElementById("output").innerHTML = "";
    }).catch((error) => {
        console.error("リセット中にエラーが発生しました:", error);
    });
});