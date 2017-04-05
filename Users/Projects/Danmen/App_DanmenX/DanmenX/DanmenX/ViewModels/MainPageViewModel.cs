﻿using Prism.Commands;
using Prism.Mvvm;
using Prism.Navigation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;

namespace DanmenX.ViewModels
{
	public class MainPageViewModel : BindableBase, INavigationAware
	{
		private string _title;
		public string Title
		{
			get { return _title; }
			set { SetProperty(ref _title, value); }
		}
		private readonly INavigationService _navigationService;
		public ICommand NavigateSecondCommand { get; }
		public ICommand NavigateManualCommand { get; }

		public MainPageViewModel(INavigationService navigationService)
		{
			_navigationService = navigationService;

			//SelectPageへ遷移
			NavigateSecondCommand = new DelegateCommand(() =>
			{
				_navigationService.NavigateAsync("SelectPage");
			});

			//ManualPageへ遷移
			NavigateManualCommand = new DelegateCommand(() =>
			{
				_navigationService.NavigateAsync("ManualPage");
			});
		}

		public void OnNavigatedFrom(NavigationParameters parameters)
		{

		}

		public void OnNavigatedTo(NavigationParameters parameters)
		{
			if (parameters.ContainsKey("title"))
				Title = (string)parameters["title"] + " and Prism";
		}
	}
}
