using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MasterMind.Startup))]
namespace MasterMind
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
