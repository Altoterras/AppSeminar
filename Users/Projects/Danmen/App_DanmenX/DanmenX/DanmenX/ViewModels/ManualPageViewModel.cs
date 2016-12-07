using Prism.Commands;
using Prism.Mvvm;
using Prism.Navigation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;

namespace DanmenX.ViewModels
{
	public class ManualPageViewModel : BindableBase, INavigationAware
	{
		private readonly INavigationService _navigationService;
		public ICommand NavigateMainCommand { get; }
		public ManualPageViewModel(INavigationService navigationService)
		{
			_navigationService = navigationService;

			//MainPageへ遷移
			NavigateMainCommand = new DelegateCommand(() =>
			{
				_navigationService.NavigateAsync("MainPage");
			});

		}

		public void OnNavigatedFrom(NavigationParameters parameters)
		{

		}

		public void OnNavigatedTo(NavigationParameters parameters)
		{

		}
	}
}
