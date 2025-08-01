# AviUtl_Kaleidoscope_K_Script

画像を万華鏡風に加工する，GLSLを用いた[AviUtl](http://spring-fragrance.mints.ne.jp/aviutl/)用スクリプト．

[Download](https://github.com/korarei/AviUtl_Kaleidoscope_K_Script/releases)

[AviUtl2向けDownload](https://github.com/korarei/AviUtl2_Kaleidoscope_K_Script)


## はじめに

本スクリプトの実行にはkaroterra氏のGL Shader Kitが必要です．以下のリンクからダウンロードして導入しておいてください．

[GL Shader Kit (GitHub)](https://github.com/karoterra/aviutl-GLShaderKit)


## 導入・削除

### 導入

1. 同梱の `.anm`，`.lua`，`.frag` ファイルを `script` フォルダまたはその子フォルダに入れてください．

### 削除

1. 同梱の `.anm`，`.lua`，`.frag` ファイルを`script` フォルダまたはその子フォルダから出してください．


## 使用方法

### トラックバーおよびチェックボックス

- CX，CY

  中心を指定します．この値はプレビュー上にあるアンカーでも設定できます．

- Size

  タイリングサイズ (繰り返し単位のサイズ) を百分率で指定します．100で画像の縦と横のピクセル数のうち大きい方になります．

- Rotation

  中心に合わせて画像を回転させます．

- Floating Center

  CX，CYで指定した位置を万華鏡の中心にします．


### その他の設定項目

- Mirroring

  万華鏡の種類を指定します．1から9までの全9種類用意しています．もし，範囲外の数値が指定された場合Tiler (ミラーリングしながら画像ループ) となります．

- Scale

  万華鏡そのもののサイズを指定します．
  
> [!TIP]
> トラックバーは用意していないので，トラックバーを使いたい場合は[汎用トラックバー (作者: ePi氏)](https://ux.getuploader.com/ePi/)をご利用ください．
>
> 汎用トラックバーを使用する場合，Scaleに`<汎用トラックバーで決めた変数名>[トラックバーナンバー]`を入力してください．

- Reload

  シェーダーを再読み込みします．

- PI

  パラメータインジェクションです．初期値は`nil`となっています．table型を入れると，トラックバーおよびチェックボックスの代替値として用いられます．

  ```lua
  {
    track0, -- obj.track0 number型を入れてください．tonumber()の返り値がnilの場合，無視されます．
    track1, -- obj.track1 上記と同様．
    track2, -- obj.track2 上記と同様．
    track3, -- obj.track3 上記と同様．
    check0, -- obj.check0 booleanまたはnumber型を入れてください．それ以外は無視されます．number型の場合，1はtrue，0はfalseになります．
  }
  ```


## 外部スクリプトから呼ぶ

### 呼び出し方
1.  `package.path`を編集し，`require`で読み込めるようにしてください．[package.path (scrapbox AviUtl)](https://scrapbox.io/aviutl/package.path)

2.  以下のようにして呼び出します．

    ```lua
      local is_loaded, Kaleidoscope_K = pcall(require, "Kaleidoscope_K")
      if is_loaded then
        Kaleidoscope_K.kaleidoscope(center_x, center_y, size, rotation, floating_center, mirroring, scale, reload)
      else
        error("Failed to load Kaleidoscope_K.lua.")
      end
    ```


## パラメータ
| 変数名           | 意味                            | 型      | 単位  |
|------------------|---------------------------------|---------|-------|
| center_x         | 中心のX座標                     | number  | px    |
| center_y         | 中心のY座標                     | number  | px    |
| size             | タイリングサイズ (百分率)       | number  | なし  |
| rotation         | 回転量                          | number  | deg   |
| floating_center  | 万華鏡の中心を移動              | boolean | なし  |
| mirroring        | 万華鏡の種類                    | number  | なし  |
| scale            | 万華鏡そのもののサイズ (百分率) | number  | なし  |
| reload           | シェーダーの再読み込み          | boolean | なし  |


## LICENSE
LICENSEファイルに記載


## Change Log
- **v1.0.1**
  - エラーハンドラの末尾に改行を追加
  - typeの条件分岐をifからswitch - caseに変更
  
- **v1.0.0**
  - release
