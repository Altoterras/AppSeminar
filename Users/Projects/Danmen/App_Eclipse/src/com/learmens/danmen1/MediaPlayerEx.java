package com.learmens.danmen1;

import java.io.IOException;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;

/**
 * 拡張メディアプレイヤー
 *
 */
public class MediaPlayerEx extends MediaPlayer
{
	static boolean play(Context context, int resid)
	{
		final MediaPlayer mp = new MediaPlayer();
		String uristr = "android.resource://" + context.getPackageName() + "/" + resid;
		Uri uri = Uri.parse(uristr);
		Thread thread = null;
	
		try
		{
			mp.setDataSource(context.getApplicationContext(), uri);
			// 音量
			mp.setAudioStreamType(AudioManager.STREAM_MUSIC);
			// 初期化
			mp.setLooping(false);
			mp.prepare();
			mp.seekTo(0);
			
			thread = new Thread()
			{
				public void run()
				{
					// 開始
					mp.start();
					while(mp.isPlaying())
					{
						try {Thread.sleep(1);} catch (InterruptedException ex) {}
					}
					mp.release();
				}
			}; 
			
			// 別スレッドで再生開始
			thread.start();
			
		}
		catch (IOException ex)
		{
			ex.printStackTrace();
			return false;
		}

		return true;
	}

}
