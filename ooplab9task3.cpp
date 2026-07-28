#include <iostream>
#include <string>
using namespace std;

class User
{
private:
    const string username;
    string password;

public:
    User(string u, string p) : username(u), password(p)
    {
    }

    bool authenticate(string u, string p)
    {
        if (u == username && p == password)
        {
            return true;
        }
        return false;
    }
};

class LoginSystem
{
private:
    User user;

public:
    LoginSystem(string u, string p) : user(u, p)
    {
    }

    void login()
    {
        int attempts = 3;
        string u, p;

        while (attempts > 0)
        {
            cout << "Enter username: ";
            cin >> u;
            cout << "Enter password: ";
            cin >> p;

            if (user.authenticate(u, p))
            {
                cout << "Login Successful" << endl;
                return;
            }
            else
            {
                attempts--;
                if (attempts > 0)
                {
                    cout << "Invalid Credentials. Attempts remaining: " << attempts << endl;
                }
            }
        }

        cout << "Login blocked. Too many attempts." << endl;
    }
};

int main()
{
    LoginSystem system("talha", "password123");
    system.login();

    return 0;
}