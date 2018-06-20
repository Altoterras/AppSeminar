using UnityEngine;
using System.Collections;

public class Effect : MonoBehaviour
{
    //private ParticleSystem particle;
    //GameObject pObject;
    //[SerializeField] ParticleSystem particle;
    //GameObject obj = GameObject.Find("Particle System");
    //ParticleSystem particle = obj.GetComponent<ParticleSystem>();

    // Use this for initialization
    void Start()
    {
        //particle = this.GetComponent<ParticleSystem>();
        //GameObject obj = GameObject.Find("Particle System");
        //ParticleSystem particle = obj.GetComponent<ParticleSystem>();
        // ここで Particle System を停止する.
        //particle.Stop();
        //effect.Emit(5);
        //pObject = GameObject.Find("Particle System");
        //particle = pObject.GetComponent<ParticleSystem>();
        //particle.Stop();
    }

    public void CleaEffect()
    {
        // ここで Particle System を開始します.
        //particle.Play();
        GameObject obj = GameObject.Find("Particle System");
        ParticleSystem particle = obj.GetComponent<ParticleSystem>();
        //particle.Play();
        particle.Emit(1);
    }
}