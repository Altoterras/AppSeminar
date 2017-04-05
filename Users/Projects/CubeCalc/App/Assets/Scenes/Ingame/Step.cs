using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class Step
{
	private int x;
	private int z;
	private int a;
	private int di;
	private string du;

	public int xposi {
		get { return x; }
		set { x = value; }
	}

	public int zposi {
		get { return z; }
		set { z = value; }
	}

	public int ans
	{
		get { return a; }
		set { a = value; }
	}

	public int dnum
	{
		get { return di; }
		set { di = value; }
	}

	public string duty
	{
		get { return du; }
		set { du = value; }
	}

}

