package com.learmens.qrmail;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.MenuItem;
import android.widget.ImageButton;
import android.widget.TextView;


public class MainActivity extends ActionBarActivity implements View.OnClickListener{

    /** 文字からQRコード生成     */
    private ImageButton mTextButton = null;
    /** QRコードから文字を複合    */
    private ImageButton mImageButton = null;

    /** デバッグ用    */
    private TextView mDebugTextView = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 文字をQRコードにする
        mTextButton = (ImageButton)this.findViewById(R.id.buttonText);
        mTextButton.setOnClickListener(this);

        // QRコードを文字にする
        mImageButton = (ImageButton)this.findViewById(R.id.buttonImage);
        mImageButton.setOnClickListener(this);

        mDebugTextView = (TextView)this.findViewById(R.id.debugText);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onClick (View view) {

        Intent intent = null;

        if (view == this.mTextButton) {

            // intent = new Intent(this.getApplicationContext(), com.learmens.qrmail.X1xxxxActivity);

            mDebugTextView.setText("test1");

        } else if (view == this.mImageButton) {

            // intent = new Intent(this.getApplicationContext(), com.learmens.qrmail.X2xxxxActivity);

            mDebugTextView.append("test2");

        }

        if (intent != null) {
            startActivity(intent);
        }

    }

}
