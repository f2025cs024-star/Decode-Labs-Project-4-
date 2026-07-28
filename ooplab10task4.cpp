#include<iostream>
using namespace std;

class SecurityGuard
{
    string guardName;
public:
    SecurityGuard(string name)
    {
        guardName = name;
        cout << "SecurityGuard created: " << guardName << endl;
    }

    string getName()
    {
        return guardName;
    }

    void patrol()
    {
        cout << "Guard " << guardName << " is patrolling." << endl;
    }

    ~SecurityGuard()
    {
        cout << "SecurityGuard destroyed: " << guardName << endl;
    }
};

class LockerRoom
{
    string roomId;
    SecurityGuard* guard;
public:
    LockerRoom(string id)
    {
        roomId = id;
        guard = NULL;
        cout << "LockerRoom created: " << roomId << endl;
    }

    void assignGuard(SecurityGuard* g)
    {
        guard = g;
    }

    void performCheck()
    {
        cout << "\nLocker Room " << roomId << " security check:" << endl;
        if(guard != NULL)
        {
            guard->patrol();
        }
        else
        {
            cout << "No guard assigned." << endl;
        }
    }

    ~LockerRoom()
    {
        cout << "LockerRoom destroyed: " << roomId << endl;
    }
};

class Bank
{
    string bankName;
    LockerRoom locker;
public:
    Bank(string name, string lockerId) : locker(lockerId)
    {
        bankName = name;
        cout << "Bank created: " << bankName << endl;
    }

    void assignGuardToLocker(SecurityGuard* g)
    {
        locker.assignGuard(g);
    }

    void showBank()
    {
        cout << "\nBank: " << bankName << endl;
        locker.performCheck();
    }

    ~Bank()
    {
        cout << "Bank destroyed: " << bankName << endl;
    }
};

int main()
{
    SecurityGuard g1("Ahmed");
    SecurityGuard g2("Bilal");

    cout << "\n--- Bank 1 scope ---" << endl;
    {
        Bank b1("HBL Bank", "Locker-A");
        b1.assignGuardToLocker(&g1);
        b1.showBank();

        cout << endl;

        Bank b2("MCB Bank", "Locker-B");
        b2.assignGuardToLocker(&g1);
        b2.showBank();

        cout << "\n--- Banks scope ending ---" << endl;
    }

    cout << "\nGuards still exist after banks are gone:" << endl;
    g1.patrol();
    g2.patrol();

    return 0;
}