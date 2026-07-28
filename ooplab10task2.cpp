#include<iostream>
using namespace std;

class Doctor
{
    string doctorName;
public:
    Doctor(string name)
    {
        doctorName = name;
        cout << "Doctor created: " << doctorName << endl;
    }

    string getName()
    {
        return doctorName;
    }

    void checkPatient()
    {
        cout << "Dr. " << doctorName << " is checking patients." << endl;
    }

    ~Doctor()
    {
        cout << "Doctor destroyed: " << doctorName << endl;
    }
};

class Ward
{
    string wardName;
public:
    Ward(string name)
    {
        wardName = name;
        cout << "Ward created: " << wardName << endl;
    }

    void performRounds(Doctor d)
    {
        cout << "\nRounds in " << wardName << ":" << endl;
        d.checkPatient();
    }

    ~Ward()
    {
        cout << "Ward destroyed: " << wardName << endl;
    }
};

int main()
{
    Doctor doc("Ali");

    Ward w1("General Ward");
    Ward w2("Emergency Ward");

    w1.performRounds(doc);
    w2.performRounds(doc);

    cout << "\nDoctor still exists after wards used it:" << endl;
    doc.checkPatient();

    return 0;
}