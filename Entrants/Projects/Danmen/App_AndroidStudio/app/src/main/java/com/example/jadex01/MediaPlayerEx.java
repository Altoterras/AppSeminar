package com.example.jadex01;

import java.io.IOException;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;

public class MediaPlayerEx extends MediaPlayer
{
	static boolean play(Context context, int resid)
	{
		MediaPlayer mp = new MediaPlayer();
		String uristr = "android.resource://" + context.getPackageName() + "/" + resid;
		Uri uri = Uri.parse(uristr);
		try
		{
			mp.setDataSource(context.getApplicationContext(), uri);
			// 音量
			mp.setAudioStreamType(AudioManager.STREAM_NOTIFICATION);
			// 初期化
			mp.setLooping(false);
			mp.prepare();
			mp.seekTo(0);
			// 開始
			mp.start();
		}
		catch (IOException ex)
		{
			ex.printStackTrace();
			return false;
		}
		finally
		{
			if (mp != null)
			{
				mp = null;
			}
		}
		return true;
	}
}
