# 使用說明：動態按鈕控制板

## 網址
[連結](https://pp771007.github.io/dynamic-button-dashboard/)

## 概述
這個網頁提供了一個動態按鈕控制面板，使用者可以自定義按鈕和標題，並能夠通過按鈕的點擊來切換顏色。此外，使用者還可以重置單個分區的按鈕顏色，或重置所有分區的按鈕顏色。

## 功能介紹

1. **設定按鈕**
   - 在網頁的左上角有一個齒輪圖示按鈕，點擊後會彈出設定頁面。

2. **設定頁面**
   - 設定頁面包含兩個 `textarea`：
     - **標題列表**：在這裡輸入每個分區的標題，每行一個標題。
     - **按鈕列表**：在這裡輸入每個分區的按鈕名稱，每行一個按鈕名稱。
   - 設定頁面底部有一個「儲存設定」按鈕，點擊後將保存輸入的標題和按鈕至本地儲存中，並在主畫面中更新顯示。

3. **主畫面**
   - 每個分區根據標題列表中輸入的標題生成，按鈕根據按鈕列表中的輸入生成。
   - 按鈕的預設顏色為白色，點擊按鈕可以切換顏色（白色與綠色之間切換）。

4. **重置按鈕**
   - 每個分區內都有一個「重置」按鈕，點擊後該分區內的所有按鈕將恢復為預設顏色。
   - 在畫面的右上角有一個「全部重置」按鈕，點擊後所有分區的按鈕將恢復為預設顏色。

## 使用步驟

1. **打開網頁**
   - 在瀏覽器中打開 HTML 文件，會顯示動態按鈕控制板的界面。

2. **添加標題和按鈕**
   - 點擊左上角的設定按鈕，填寫標題列表和按鈕列表。
   - 每行輸入一個標題或按鈕名稱。

3. **儲存設定**
   - 點擊「儲存設定」按鈕，將您的輸入保存至本地儲存中，主畫面會更新以顯示新的分區和按鈕。

4. **操作按鈕**
   - 在主畫面上，點擊任何按鈕以切換其顏色（白色與綠色之間切換）。
   - 若需要重置某個分區的按鈕顏色，點擊該分區的「重置」按鈕。
   - 若需要重置所有分區的按鈕顏色，點擊畫面右上角的「全部重置」按鈕。

## 注意事項
- 所有設定和狀態都會儲存在本地儲存中，關閉網頁後不會丟失。
- 確保您的瀏覽器支援本地儲存功能以正常使用所有功能。
