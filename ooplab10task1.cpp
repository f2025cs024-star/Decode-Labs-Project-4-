#include<iostream>
using namespace std;

class Ward
{
    string wardName;
public:
    Ward(string name)
    {
        wardName = name;
        cout << "Ward created: " << wardName << endl;
    }

    void showWardName()
    {
        cout << "Ward Name: " << wardName << endl;
    }

    ~Ward()
    {
        cout << "Ward destroyed: " << wardName << endl;
    }
};

class Hospital
{
    string hospitalName;
    Ward ward;
public:
    Hospital(string hName, string wName) : ward(wName)
    {
        hospitalName = hName;
        cout << "Hospital created: " << hospitalName << endl;
    }

    void displayHospital()
    {
        cout << "Hospital Name: " << hospitalName << endl;
        ward.showWardName();
    }

    ~Hospital()
    {
        cout << "Hospital destroyed: " << hospitalName << endl;
    }
};

int main()
{
    Hospital h("City Hospital", "ICU");
    h.displayHospital();

    cout << "\nEnd of main - objects will now be destroyed:" << endl;

    return 0;
}