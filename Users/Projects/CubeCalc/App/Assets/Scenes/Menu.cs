﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Menu : MonoBehaviour {

	[SerializeField] public Scene _scene;

	public void OnMenuOpenButton()
	{
		gameObject.SetActive(true);
	}

	public void OnMenuCloseButton()
	{
		gameObject.SetActive(false);
	}

	public void OnRetryButton()
	{
		_scene.RetryStage();
	}

	public void OnNextButton()
	{
		_scene.Debug_NextStage();
	}

	public void OnPrevButton()
	{
		_scene.Debug_PrevStage();
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
